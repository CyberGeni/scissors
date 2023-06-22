import { NavLink, useNavigate } from "react-router-dom";
import '../../../App.css'
import dashboardIcon from '../../../assets/icons/dashboard-icon.png';
import plansIcon from '../../../assets/icons/plans-icon.png';
import settingsIcon from '../../../assets/icons/settings-icon.png';
import logoutIcon from '../../../assets/icons/log-out.png';
import supabase from "../../../supabase";
const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const logout = async () => {
        supabase.auth.signOut();
        navigate('/');
    };

    return (
        <>
            {/* desktop sidebar */}
            <div className="hidden sm:block sidebar fixed h-screen sm:w-1/4 lg:w-1/5 border-r border-r-gray-200 px-8 py-7">
                <nav className="h-full flex flex-col">
                    <h1 className="text-center text-blue-600 text-3xl font-medium tracking-tighter whitespace-nowrap ">btchr <span className="text-blue-900 text-3xl leading-none -ml-2.5">.</span></h1>
                    <div className="flex flex-col h-full justify-between content-between my-6">
                        <div className="flex flex-col h-full">
                            <NavLink className="flex items-center py-3 rounded-md space-x-1.5" to="/dashboard" end>
                                <div className="side-line w-1 h-full bg-white rounded-xl ml-1.5"></div>
                                <img className="w-5 h-5" src={dashboardIcon} alt="" />
                                <span className="mt-0.5">Dashboard</span>
                            </NavLink>
                            <NavLink className="flex items-center py-3 rounded-md space-x-1.5" to="/dashboard/plans" end>
                                <div className="side-line w-1 h-full bg-white rounded-xl ml-1.5"></div>
                                <img className="w-5 h-5" src={plansIcon} alt="" />
                                <span className="mt-0.5">Plans</span>
                            </NavLink>
                            <NavLink className="flex items-center py-3 rounded-md space-x-1.5" to="/dashboard/settings" end>
                                <div className="side-line w-1 h-full bg-white rounded-xl ml-1.5"></div>
                                <img className="w-5 h-5" src={settingsIcon} alt="" />
                                <span className="mt-0.5">Settings</span>
                            </NavLink>
                        </div>
                        <div className="h-fit mx-auto">
                            <button onClick={logout} className="px-6 rounded-md py-3 border border-gray-300 space-x-2 flex items-center">
                                <span className="text-gray-500">Logout</span>
                                <img className="w-5 " src={logoutIcon} alt="" />
                            </button>
                        </div>
                    </div>
                </nav>
            </div>
            {/* switches to bottom bar on mobile */}
            <div className="bottom-bar flex sm:hidden fixed bottom-0 w-full">
                <nav className="flex justify-around items-center w-full h-20 border-t ">
                    <NavLink className="space-y-1 w-1/4 rounded-2xl h-3/4 flex flex-col items-center justify-center" to="/dashboard" end>
                        <img className="w-5 h-5" src={dashboardIcon} alt="" />
                        <span className="text-xs text-gray-500">Dashboard</span>
                    </NavLink>
                    <NavLink className="space-y-1 w-1/4 rounded-2xl h-3/4 flex flex-col items-center justify-center" to="/dashboard/plans" end>
                        <img className="w-5 h-5" src={plansIcon} alt="" />
                        <span className="text-xs text-gray-500">Plans</span>
                    </NavLink>
                    <NavLink className="space-y-1 w-1/4 rounded-2xl h-3/4 flex flex-col items-center justify-center" to="/dashboard/settings" end>
                        <img className="w-5 h-5" src={settingsIcon} alt="" />
                        <span className="text-xs text-gray-500">Settings</span>
                    </NavLink>
                </nav>
            </div>
        </>
    )
}
export default Sidebar;