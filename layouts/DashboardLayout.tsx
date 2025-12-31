import React,{useEffect} from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '@/components/Header';
import { getMe } from '@/graphql/user';
import { useUser } from '@/provider/UserProvider';

const DashboardLayout = () => {

  const {setUser} = useUser();
  const [loading, setLoading] = React.useState(true);

  const fetchMe = async () => {
    try{
      const res:any = await getMe();
      setUser(res?.data?.me)
    }catch(err){

    }finally{
      setTimeout(() => {
        setLoading(false);
      },1000)
    }
  }
  
  useEffect(() => {
    fetchMe();
  }, []);

  if(loading){
    return <p>Loading...</p>
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Header/>
      <main className="flex-1 ml-64 transition-all duration-300 ease-in-out p-8 mt-10">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
