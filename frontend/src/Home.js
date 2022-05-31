import axios from "axios";
import { React, useState } from "react";
import { Navbar } from "react-bootstrap";
import bootstrap from "bootstrap";
import GetUser from "./dbfunc/GetUser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Home() {
  const [users, setUsers] = useState([]);
  const url = "http://localhost:5000/users";
  let name = "";
  let mail = "";
  const [formToggle, setFormToggle] = useState(false);
  let password = "";
  const [TableToggle, setTableToggle] = useState(false);
  const notify = (msg) => toast(msg);
  //////////////////////////////////////////////////////
  async function GetUser() {
    try {
      axios.get(url).then((res) => {
        setUsers(res.data);
      });
    } catch (err) {
      setUsers({ "name": "No Data", "mail": "No Data" });
    }
  }
  /////////////////////////////////////////////////////
  async function LogUser() {
    try {
      await axios
        .post("http://localhost:5000/users/mail", {
          mail: mail,
          password: password,
        })
        .then((res) => {
          if (
            res.data["message"] === "user found" &&
            res.data["mail"] === mail &&
            res.data["password"] === password
          ) {
            console.log(res.data);
            toast.success("Welcome!", {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            setTableToggle(true);
            GetUser();
          } else {
            toast.error("Please Check Credentials!", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
        });
    } catch (err) {
      notify("can't Log in!");
    }
  }
  //////////////////////////////////////////////////////
  async function SignUser() {
    try {
      await axios
        .post("http://localhost:5000/users", {
          mail: mail,
          password: password,
          name: name
        }).then((res)=>{
          if(res.data["message"] === "user exists!"){
            toast.error("Mail ID ins use. Please proceed with another!", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
          else{
            console.log(res.data);
            toast.success("Welcome!", {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            setTableToggle(true);
            GetUser();
          }
        })
      }
      catch(err){
        notify("can't sign up")
      }
    }
  /////////////////////////////////////////////////////
  async function DelUser(id) {
    try {
      let result = await axios.delete(`http://localhost:5000/users/${id}`);
      console.log(result.response.data);
    } catch (err) {}
    await GetUser();
  }
  /////////////////////////////////////////////////////
  let usertable = (
    <div>
      <table className="table">
        <thead>
          <th>Name</th>
          <th>Mail</th>
        </thead>
        <tbody>
          {users.map((user, i) => (
            <tr key={i}>
              <td>{user["name"]}</td>
              <td>{user["mail"]}</td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={(e) => DelUser(String(user["_id"]))}
                >
                  Trash
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const loginfrom = (
    <span className="justify-content-left px-md-5">
      <form className="mb-3">
        <br></br>
        <input required
          type="email"
          placeholder="E-mail"
          onChange={(e) => {
            mail = e.target.value;
          }}
        ></input>
        <br></br>
        <br></br>
        <input required
          type="password"
          placeholder="password"
          onChange={(e) => {
            password = e.target.value;
          }}
        ></input>
        <br></br>
        <br></br>
        <button
          type="button"
          className="btn btn-primary btn-block mb-4"
          onClick={LogUser}
        >
          LogIn
        </button>
        <span></span>
        <button
          type="button"
          variant="outline-success"
          className="btn"
          onClick={()=>{setFormToggle(!formToggle)}}
        >SignUp</button>
      </form>
    </span>
  );

  let signupform = (
    <span className="justify-content-left px-md-5">
      <form className="mb-3">
        <br></br>
        <input required
          type="text"
          placeholder="Name"
          onChange={(e) => {
            name = e.target.value;
          }}
        ></input>
        <br></br>
        <br></br>
        <input required
          type="email"
          placeholder="E-mail"
          onChange={(e) => {
            mail = e.target.value;
          }}
        ></input>
        <br></br>
        <br></br>
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => {
            password = e.target.value;
          }}
        ></input>
        <br></br>
        <br></br>
        <button
          type="button"
          variant="outline-success"
          className="btn"
          onClick={()=>{setFormToggle(!formToggle)}}
        >
          Log In
        </button>
        <button
          type="button"
          className="btn btn-primary btn-block mb-4"
          onClick={SignUser}
        >
          Sign Up
        </button>  
      </form>
    </span>
  );
    let form = formToggle?loginfrom:signupform
  return (
    <div>
      <Navbar
        bg="primary"
        variant="dark"
        className="justify-content-left px-md-5"
      >
        <Navbar.Brand>RFC CLEAN</Navbar.Brand>
        <Navbar.Collapse>
          {TableToggle ? (
            <button
              type="button"
              className="btn btn-primary justify-content-right"
              variant="light"
              onClick={GetUser}
            >
              Get Items
            </button>
          ) : (
            <div></div>
          )}
          {TableToggle ? (
            <button
              type="button"
              className="btn btn-primary justify-content-right"
              variant="light"
              onClick={() => setTableToggle(false)}
            >
              LogOut
            </button>
          ) : (
            <div></div>
          )}
        </Navbar.Collapse>
      </Navbar>
      <ToastContainer />
      
      {TableToggle ? usertable : form}
    </div>
  );
}
export default Home;
