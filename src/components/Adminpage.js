import { useRouter } from 'next/router';
import supabaseAdmin from '@/lib/supabaseAdmin';
import { useEffect, useState } from 'react';

const Adminpage = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);

  useEffect(() => {

    const fetchUsers = async () => {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('username, aadhaar');
      if (data) {
        setUsers(users);
        console.log(data);
      }
    };
    fetchUsers();
  }, []);

  return <div>Admin Page</div>;
};

export default Adminpage;
