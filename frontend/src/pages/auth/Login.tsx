import { Link } from "react-router-dom";

const Login = () => {
  return (     
<main className="w-full h-screen flex flex-col items-center justify-center px-4">
  <div className="max-w-sm w-full text-gray-600 space-y-5">
    <div className="text-center pb-6">
      <img src="/img/icon.png" width={150} className="mx-auto" />
      <div className="mt-5">
        <h3 className="text-[#035CB0] text-2xl font-bold sm:text-3xl">
          Admin Login
        </h3>
      </div>
    </div>
    <form onSubmit={(event) => { event.preventDefault(); }} className="space-y-5">
      <div>
        <label className="font-medium"> Email </label>
        <input type="email" required className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-red-600 shadow-sm rounded-lg" />
      </div>
      <div>
        <label className="font-medium"> Password </label>
        <input type="password" required className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-red-600 shadow-sm rounded-lg" />
      </div>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-x-3">
          <input type="checkbox" id="remember-me-checkbox" className="checkbox-item peer hidden" />
          <label htmlFor="remember-me-checkbox" className="relative flex w-5 h-5 bg-white peer-checked:bg-red-600 rounded-md border ring-offset-2 ring-red-600 duration-150 peer-active:ring cursor-pointer after:absolute after:inset-x-0 after:top-[3px] after:m-auto after:w-1.5 after:h-2.5 after:border-r-2 after:border-b-2 after:border-white after:rotate-45" />
          <span>Remember me</span>
        </div>
        <a href="javascript:void(0)" className="text-center text-red-600 hover:text-red-500">Forgot password?</a>
      </div>
      <div className="buttons flex justify-between">
        <Link to="/" className="w-[100px] px-4 py-2 text-white font-medium bg-[#035CB0] hover:text-yellow-400 active:bg-[#26445fe9] rounded-lg duration-150">
          <i className="ri-home-4-line mr-1"></i>
          Home
        </Link>
        <button className="w-2/3 px-4 py-2 text-white font-medium bg-red-600 hover:bg-red-500 active:bg-red-600 rounded-lg duration-150 cursor-pointer">
          LOG IN
        </button>
      </div>
    </form>
  </div>
</main>


  )
}

export default Login