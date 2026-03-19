import { Link } from "react-router";
import "../styles/styles.css";


export function LoginPage() {
    return (
        <main>
          <div className="navBar">
                <>
                <Link to='/' className='navButton'>Home</Link>
                </>
            </div>
        </main>
    );

}