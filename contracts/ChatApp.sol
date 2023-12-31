// SPDX-License-Identifier: MIT
pragma solidity >= 0.7.0 < 0.9.0;

contract ChatApp{
    //User structure
    struct user{
        string name;
        friend[] friendList;
    }

    struct friend{
        address pubkey; //address is 20-byte value that represents an ethereum address.
        string name;
    }

    struct message{
        address sender;
        uint256 timestamp;
        string msg;
    }

    struct allUserStruck{
        string name;
        address accountAddress;
    }
    
    allUserStruck[] getAllUsers;

    mapping(address => user) userList;
    mapping(bytes32 => message[]) allMessage; //bytes : It is a string with max length of 32

    //Check user exist
    function checkUserExists(address pubkey) public view returns(bool){
        return bytes(userList[pubkey].name).length > 0 ;
    }

    //Create account, msg.sender = Mine account address
    function createAccount(string calldata name) external{
        require(checkUserExists(msg.sender) == false, "User already exists"); //It is like a condition
        require(bytes(name).length > 0,"Username cannot be empty");

        userList[msg.sender].name = name;
        getAllUsers.push(allUserStruck(name,msg.sender));
    }
    
    //Get username
    function getUsername(address pubkey) external view returns(string memory) {
        require(checkUserExists(pubkey),"User is not registered");
        return userList[pubkey].name;
    }

    //Add friends
    function addFriend(address friend_key, string calldata name) external {
        require(checkUserExists(msg.sender),"Create an account first");
        require(checkUserExists(friend_key),"User is not registered");
        require(msg.sender != friend_key,"User cannot add themeselves as friend");
        require(checkAlreadyFriends(msg.sender,friend_key) == false,"These users are already friends");
        _addFriend(msg.sender,friend_key,name);
        _addFriend(friend_key,msg.sender,userList[msg.sender].name);
    }

    //check already friend or not
    function checkAlreadyFriends(address pubkey1, address pubkey2) internal view returns(bool) {
        if(userList[pubkey1].friendList.length > userList[pubkey2].friendList.length){
            address temp = pubkey1;
            pubkey1 = pubkey2;
            pubkey2 = temp;
        }

        for(uint256 i=0;i<userList[pubkey1].friendList.length;i++){
            if(userList[pubkey1].friendList[i].pubkey == pubkey2){
                return true;
            }
        }
        return false;
    }

    //_addFriend or make connection, memory : Store the data temporarily during the execution of smart contract
    function _addFriend(address me, address friend_key, string memory name) internal {
        friend memory newFriend = friend(friend_key,name);
        userList[me].friendList.push(newFriend);
    }

    //Get my friend
    function getMyFriendList() external view returns(friend[] memory){
        return userList[msg.sender].friendList;
    }

    //Get chat code
    function _getChatCode(address pubkey1, address pubkey2) internal pure returns(bytes32){
        if(pubkey1 < pubkey2){
            return keccak256(abi.encodePacked(pubkey1,pubkey2)); //keccak256 is hash function
        }
        else{
            return keccak256(abi.encodePacked(pubkey2,pubkey1));
        }
    }

    //Send message
    function sendMessage(address friend_key, string calldata _msg) external {
        require(checkUserExists(msg.sender),"Create an account first");
        require(checkUserExists(friend_key),"User is not registered");
        require(checkAlreadyFriends(msg.sender,friend_key),"You are not friend with the given user");
        
        bytes32 chatCode = _getChatCode(msg.sender, friend_key);
        message memory newMsg = message(msg.sender,block.timestamp,_msg);
        allMessage[chatCode].push(newMsg);
    }

    //Read msg
    function readMessage(address friend_key) external view returns(message[] memory) {
        bytes32 chatCode = _getChatCode(msg.sender, friend_key);
        return allMessage[chatCode];
    }

    //Get all app user
    function getAllAppUser() external view returns(allUserStruck[] memory) {
        return getAllUsers;
    }
}