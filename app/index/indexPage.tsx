import { Link } from "react-router";


export function IndexPage() {
    return (
        <main>
            <div style= {{ display: 'flex', gap: '8px', padding: '8px', 
            background: '#695e5e', borderTop: '3px solid #161212', justifyContent: 'Center'}}>
                <>
                <Link to='/history'>History</Link>
                </>
            </div>
        </main>
    )
}