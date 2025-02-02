import { useEffect, useState } from "react";
import { Loader } from "../../components";
import { register } from "../../api/user-api";
import { useNavigate } from "react-router-dom";
import { read_from_storage, write_to_storage } from "../../storage";

const Register = () => {
  const navigate =useNavigate()
  const [isLoading, setIsLoading] =useState(false);
  const [canSubmit, setCanSubmit] =useState(false);
  const [lastName, setLastName] =useState<string>('');
  const [firstName, setFirstName] =useState<string>('');
  const [serverMsg, setServerMsg] =useState<string>()

  const updateEntry =(value: string, callback:any) =>{
    callback(value);
    setCanSubmit((lastName && firstName) && value? true : false);
  }
  
  const onSubmit =async () =>{
    setIsLoading(true)
    try {
      const {status, message} =await register({first_name: firstName, last_name: lastName});
      if (status ==201) {
        write_to_storage('user', {userid: message})
        return  navigate('/', {replace: true});
      }
      setServerMsg(message)
    } catch (error: any) {
      let message =null;
        if(error.response) message =error.response.data.message
        else message =error?.message
      setServerMsg(message)
    }finally{
      setIsLoading(false);
    }
  }
  useEffect(() =>{
    const {userid} =read_from_storage('user');
    if(userid) return  navigate('/', {replace: true});
  }, [])
  return (
    <div className="h-[100svh] flex md:justify-center items-center flex-col bg-slate-100 gap-4 md:p-0">
      <section className="md:shadow h-full md:h-auto p-8 rounded-md bg-white flex flex-col gap-4 w-full md:w-[500px]">
        <h2 className="text-xl font-semibold uppercase">Join the competition</h2>
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#333]">First name</label>
            <input className="border outline-none block px-4 py-2 rounded-md" onChange={e =>updateEntry(e.target.value, setFirstName)} placeholder="Enter first name" disabled ={isLoading}/>
        </div>
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#333]">Last name</label>
            <input className="border outline-none block px-4 py-2 rounded-md" onChange={e =>updateEntry(e.target.value, setLastName)} placeholder="Enter last name" disabled ={isLoading}/>
        </div>
        <div>
          {isLoading?  <Loader />: <button onClick={onSubmit} disabled ={!canSubmit} className="block text-white transition bg-blue-500 disabled:bg-blue-300 rounded px-4 py-2 hover:bg-blue-700">Register</button>}
        </div>
        <small className="text-gray-600"><i>Powered by office olympics</i></small>
      </section>
      {serverMsg && <p className="rounded text-sm p-4 text-left lg:w-[500px] bg-red-100 text-red-500">{serverMsg}</p>}
    </div>
  )
}

export default Register;
