import { createContext, useEffect, useState } from "react";
import { CheckIfWalletConnected, connectWallet, connectingWithContract } from "../utils/ApiFeature";
import { useNavigate } from "react-router-dom";


export const ChatAppContext = createContext();

export const ChatAppContextProvider = (props)=>{
    const children = props.children;
    const navigate = useNavigate();
    const [account,setAccount] = useState("");
    const [username,setUsername] = useState("");
    const [friendLists,setFriendLists] = useState([]);
    const [friendMsg, setFriendMsg] = useState([]);
    const [loading,setLoading] = useState(false);
    const [userLists,setUserLists] = useState([]);
    const [error,setError] = useState("");


    const [currentUsername,setCurrentUsername] = useState("");
    const [currentUserAddress,setCurrentUserAddress] = useState("");

    //Fetch all necessary data
    const fetchData = async()=>{
        try {
            const contract = await connectingWithContract();
            const connectAccount = await connectWallet();
            setAccount(connectAccount);
            const username = await contract.getUsername(connectAccount);
            setUsername(username);
            //friendList
            const friendList = await contract.getMyFriendList();
            setFriendLists(friendList);
            //Get all app user
            const userLists = await contract.getAllAppUser();
            setUserLists(userLists);
        }
        catch (error) {
            setError("Please install and connect your wallet");
        }
    };

    useEffect(()=>{
        fetchData();
    },[]);

    const readMessage = async(friendAddress)=>{
        try {
            if(!friendAddress){
                return setError("Please send friend address and reload browser");
            }

            const contract = await connectingWithContract();
            const read = await contract.readMessage(friendAddress);
            setFriendMsg(read);   
        }
        catch (error) {
            setError("Currently you have no msg");
        }
    }

    const createAccount = async(name,accountAddress)=>{
        try {
            if(!name || !accountAddress){
                return setError("Name and Account address must be there, it can't be empty");
            }

            const contract = await connectingWithContract();
            const getCreatedUser = await contract.createAccount(name);
            setLoading(true);
            await getCreatedUser.wait();
            setLoading(false);
            window.location.reload();
        }
        catch (error) {
            setError("Error, while creating your account. Please reload the browser")    
        }
    }

    const addFriends = async(name,accountAddress)=>{
        try {
            if(!name || !accountAddress){
                return setError("Name and Account address must be there, it can't be empty");
            }

            const contract = await connectingWithContract();
            const addMyFriend = await contract.addFriend(accountAddress,name);
            setLoading(true);
            await addMyFriend.wait();
            setLoading(false);
            navigate('/');
            window.location.reload();
        }
        catch (error) {
            setError("Something error while adding friend, please reload browser. ")    
        }
    }

    const sendMessage = async(message,friendAddress)=>{
        try {
            if(!message || !!friendAddress){
                return setError("Message and Friend Address can't be empty!!");
            }

            const contract = await connectingWithContract();
            const sendMessage = await contract.sendMessage(friendAddress,message);
            setLoading(true);
            await sendMessage.wait();
            setLoading(false);
            window.location.reload();
        } 
        catch (error) {
            setError("Something went wrong while sending message, please reload browser.")
        }
    }

    const readUser = async(friendAddress)=>{
        try {
            if(!friendAddress){
                return setError("Please send friend address and reload browser");
            }

            const contract = await connectingWithContract();
            const friendName = await contract.getUsername(friendAddress);
            setCurrentUsername(friendName);
            setCurrentUserAddress(friendAddress);
        } catch (error) {
            setError("Something went wrong while reading msg, please reload browser.");
        }
    }

    const value = {account,setAccount,
                    username,setUsername,
                    friendLists,setFriendLists,
                    friendMsg,setFriendMsg,
                    loading,setLoading,
                    userLists,setUserLists,
                    error,setError,
                    currentUsername,setCurrentUsername,
                    currentUserAddress,setCurrentUserAddress,
                    readMessage, createAccount, addFriends, sendMessage, readUser
                };

    return <ChatAppContext.Provider value={{value}} >
            {children}
    </ChatAppContext.Provider>
}