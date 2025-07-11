function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: '#1f2937', marginBottom: '20px' }}>🧠 AI Board of Advisors</h1>
      <p style={{ color: '#6b7280', marginBottom: '30px' }}>Strategic Guidance Platform - Test Version</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>👩‍💼</div>
          <h3 style={{ color: '#1f2937', marginBottom: '5px' }}>Sarah Chen</h3>
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '10px' }}>CEO Advisor - Strategic Planning</p>
          <button style={{ backgroundColor: '#3b82f6', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            Start Conversation
          </button>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>👨‍💻</div>
          <h3 style={{ color: '#1f2937', marginBottom: '5px' }}>Marcus Rodriguez</h3>
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '10px' }}>CFO Advisor - Financial Analysis</p>
          <button style={{ backgroundColor: '#3b82f6', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            Start Conversation
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;