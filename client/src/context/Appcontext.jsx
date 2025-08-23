import { createContext,useEffect,useState} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const Appcontext=createContext()

const AppcontextProvider=(props)=>{
    const [user, setUser] = useState(null); 
    const [showLogin, setShowLogin] = useState(false);
    const[token, setToken] = useState(localStorage.getItem('token' )) 
    const[credit, setCredit] = useState(false)

    const navigate=useNavigate()
    //find the credit using API
    const loadCreditsData = async ()=>{
        try{
          //api call
          const {data}=await axios.get(backendUrl + '/api/user/credits',{
            headers:{token}
          })
          //set the credit
          if(data.success){
            setCredit(data.credits)
            setUser(data.user)
          }
        }catch{
            toast .error("Error in loading credits" )
        }
    }

    //call api to generate image prompt
    const generateImage = async (prompt)=>{
        try{
           const {data}= await axios.post(backendUrl + '/api/image/generate-image', { prompt }, { headers: { token } })
           if(data.success){
            loadCreditsData()
            return data.resultImage
           }else{
            toast.error(data.message)
            loadCreditsData()
            if(data.credits === 0){
                //user will go to buy credits page
                //we use navigation hook in navbar
                navigate('/Buy')
            }
           }
        }catch{
            toast.error("Error in generating image")
        }
    }

    //log out
    const logout = ()=>{
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
    }

    useEffect(() => {
        if(token) loadCreditsData(); //token is true
    }, [token]); // eslint-disable-line react-hooks/exhaustive-deps
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const value={
        user,setUser,showLogin,setShowLogin,backendUrl,token, setToken,credit, setCredit, logout, loadCreditsData, generateImage
    }
    return(
        <Appcontext.Provider value={value}>
            {props.children}
        </Appcontext.Provider>
    )
}
export default AppcontextProvider