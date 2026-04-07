export default function AdminLayout({ children }) {
    return (
        <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
            <nav style={{ background: '#ed8936', padding: '1rem 2rem', color: 'white' }}>
                <h1 style={{ margin: 0 }}>Admin Portal</h1>
            </nav>
            <main style={{ padding: '2rem' }}>{children}</main>
        </div>
    );
}
