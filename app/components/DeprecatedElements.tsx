/* 
  Snippets removed during Portal Rebranding (April 2026)
  Save these for future reference as requested by user.
*/

// 1. HERO SECTION (Welcome Text & ESM Hero Image)
/*
<section style={{ 
  padding: '80px 40px', 
  display: 'grid', 
  gridTemplateColumns: '1fr 1fr', 
  alignItems: 'center', 
  gap: '60px',
  maxWidth: '1400px',
  margin: '0 auto'
}}>
  <div>
    <h1 style={{ fontSize: '48px', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-1px' }}>
      Welcome to <br />
      <span style={{ color: '#3b82f6' }}>Enterprise Service</span> <br />
      Management Portal
    </h1>
    <p style={{ fontSize: '18px', color: '#64748b', marginBottom: '40px', maxWidth: '500px' }}>
      Get the help you need across all departments. Search for services, report issues, or check your request status.
    </p>
    
    <div style={{ position: 'relative', maxWidth: '500px' }}>
      <div style={{ 
        position: 'absolute', 
        left: '16px', 
        top: '50%', 
        transform: 'translateY(-50%)' 
      }}>
        <NavIcon name="search" size={20} color="#94a3b8" />
      </div>
      <input 
        type="text" 
        placeholder="Search services, help articles, or ticket IDs..." 
        style={{ 
          width: '100%', 
          padding: '18px 18px 18px 52px', 
          borderRadius: '16px', 
          border: '1px solid #e2e8f0', 
          background: '#fff',
          fontSize: '16px',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
          outline: 'none'
        }}
      />
    </div>
  </div>
  
  <div style={{ position: 'relative' }}>
    <img 
      src="/esm_portal_hero.png" 
      alt="ESM Hero" 
      style={{ 
        width: '100%', 
        borderRadius: '24px', 
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)' 
      }}
    />
  </div>
</section>
*/


// 2. PENDING APPROVALS CARD (Right Sidebar)
/*
<div className="card" style={{ padding: '0' }}>
  <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Pending Approvals</h3>
    <span style={{ fontSize: '12px', color: '#3b82f6', fontWeight: 600 }}>Show All</span>
  </div>
  <div style={{ padding: '40px 20px', textAlign: 'center' }}>
    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
      <NavIcon name="bolt" size={24} color="#94a3b8" />
    </div>
    <p style={{ fontSize: '14px', color: '#64748b' }}>No pending approvals for you.</p>
  </div>
</div>
*/


// 3. KNOWLEDGE BASE CARD (Right Sidebar)
/*
<div className="card" style={{ background: 'linear-gradient(135deg, #1e293b, #334155)', color: '#fff' }}>
   <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>Knowledge Base</h3>
   <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '16px' }}>
     Browse through our extensive library of FAQs and self-help articles.
   </p>
   <button style={{ 
     width: '100%', 
     padding: '10px', 
     borderRadius: '8px', 
     border: '1px solid rgba(255,255,255,0.2)', 
     background: 'rgba(255,255,255,0.1)', 
     color: '#fff', 
     fontWeight: 600,
     cursor: 'pointer'
   }}>
     Explore Articles
   </button>
</div>
*/
