import axios from "axios";



const url = "http://localhost:5000/users";

async function GetUser(){
    axios.get(url).then(res => {
      return(res.data)
    })
  }
export default GetUser;