import re

with open("frontend/src/components/portals/AdminDashboard.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update the main layout wrapper
# From:
#     <div
#       className="min-h-screen bg-neutral-950 text-white font-display pb-20 relative selection:bg-neutral-800 selection:text-white"
#     >
# To:
#     <div className="flex h-screen bg-white font-display selection:bg-[#d4a373]/30">

content = re.sub(
    r'<div\s+className="min-h-screen bg-neutral-950 text-white font-display pb-20 relative selection:bg-neutral-800 selection:text-white"\s*>',
    '<div className="flex h-screen bg-white font-display text-neutral-900 selection:bg-[#d4a373]/30">',
    content
)

# 2. Add the Sidebar and change the main content area
# We need to replace the top navigation tabs with the sidebar.

sidebar_html = """
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-[#d4a373] flex flex-col shadow-xl z-20">
        <div className="p-6 border-b border-black/10 flex items-center gap-3">
          <img src="/images/favicon-circle.png" alt="Logo" className="w-10 h-10 object-contain" />
          <div>
            <h1 className="text-black font-extrabold leading-none font-serif">Madhav Pharma</h1>
            <p className="text-xs text-neutral-800 font-bold mt-1">Admin Portal</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'quotes', label: 'Quotes & Pricing', icon: FileText, badge: quotes.length > 0 ? quotes.length.toString() : undefined },
            { id: 'customers', label: 'Customers & Leads', icon: Users, badge: customers.length > 0 ? customers.length.toString() : undefined },
            { id: 'products', label: 'Products (MOQ & Stock)', icon: Package },
            { id: 'sales', label: 'Sales Team', icon: Briefcase },
            { id: 'orders', label: 'Orders & Invoices', icon: ShoppingBag },
            { id: 'settings', label: 'Company & GST Settings', icon: SettingsIcon },
            { id: 'logs', label: 'Logs', icon: AlertCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-black text-white shadow-lg'
                    : 'text-black hover:bg-black/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </div>
                {tab.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isActive ? 'bg-[#d4a373] text-black' : 'bg-black text-white'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-black/10">
          <button onClick={() => setPortal('storefront')} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-black/20 text-black hover:bg-black/5 text-xs font-bold uppercase transition-colors mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Storefront
          </button>
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN PANEL */}
      <main className="flex-1 overflow-y-auto bg-neutral-50 relative">
"""

# Find the start of `<div className="relative z-10">` and replace up to `<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">` and the tabs
# The original code has a top header that we want to replace entirely with the sidebar.

header_start = content.find('<div className="relative z-10">')
tabs_end = content.find('</div>\n\n          {/* Tab 1: OVERVIEW */}')

if header_start != -1 and tabs_end != -1:
    content = content[:header_start] + sidebar_html + '        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">\n' + content[tabs_end + 6:]

# Now replace the closing tag of the main block.
# We had `<div className="relative z-10">` which was closed at the very end. We replaced it with `<main...>`, so the final `</div>` should be `</main>`.
content = content.replace(
    """      {/* Edit Product Pricing Modal */}""",
    """      </main>\n\n      {/* Edit Product Pricing Modal */}"""
)

# 3. GLOBAL THEME REPLACEMENTS FOR RIGHT PANEL
# Since we have light theme, we need to convert dark classes.
# We only do these replacements inside the <main> block to not mess up modals if possible, but actually we can just globally replace.
# Actually, the modal should stay dark as per the screenshot from earlier (it was a dark modal).
# Let's split content at `<main>` and `</main>` and only run string replacement on the inside part!

main_start = content.find('<main')
main_end = content.find('</main>')

if main_start != -1 and main_end != -1:
    main_content = content[main_start:main_end]
    
    # Text colors
    main_content = main_content.replace('text-white', 'text-neutral-900')
    main_content = main_content.replace('text-neutral-300', 'text-neutral-700')
    main_content = main_content.replace('text-neutral-400', 'text-neutral-600')
    
    # Backgrounds
    main_content = main_content.replace('bg-neutral-900/70', 'bg-white')
    main_content = main_content.replace('bg-neutral-900/50', 'bg-white')
    main_content = main_content.replace('bg-neutral-900', 'bg-white')
    main_content = main_content.replace('bg-neutral-800', 'bg-neutral-100')
    main_content = main_content.replace('bg-neutral-950', 'bg-white')
    
    # Borders
    main_content = main_content.replace('border-white/10', 'border-neutral-200')
    main_content = main_content.replace('border-white/15', 'border-neutral-200')
    main_content = main_content.replace('border-white/5', 'border-neutral-100')
    main_content = main_content.replace('border-neutral-800', 'border-neutral-200')
    
    # Hover states
    main_content = main_content.replace('hover:bg-neutral-800', 'hover:bg-neutral-50')
    main_content = main_content.replace('hover:bg-white/5', 'hover:bg-neutral-100')
    main_content = main_content.replace('hover:bg-white/10', 'hover:bg-neutral-200')
    main_content = main_content.replace('hover:text-white', 'hover:text-black')
    
    # Fix specific table header styles
    main_content = main_content.replace('text-neutral-400 text-xs uppercase tracking-wider', 'text-neutral-500 text-xs uppercase tracking-wider bg-neutral-50')
    
    # Shadow and cards
    main_content = main_content.replace('shadow-xl', 'shadow-sm border border-neutral-200')
    main_content = main_content.replace('shadow-2xl', 'shadow-md border border-neutral-200')
    
    # Fix placeholder text color
    main_content = main_content.replace('placeholder-neutral-500', 'placeholder-neutral-400')
    
    content = content[:main_start] + main_content + content[main_end:]

# 4. We also need to fix the outer div closing tags.
# Before:
#     </div>
#   );
# };
# Because we replaced the outer relative z-10 with <main>, the closing structure should be correct, but we need to verify.
# Our replacement was: `</div>\n\n          {/* Tab 1: OVERVIEW */}` which means we consumed the tabs div but we added a wrapper.

with open("frontend/src/components/portals/AdminDashboard.tsx", "w", encoding="utf-8") as f:
    f.write(content)
