import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../Styles/Register.scss";
import RoleRadio from "../components/RoleRadio";
import google from "../assets/google.svg";
import phone from "../assets/phone.png";
import { SignUp, updateUser } from "../utils/utils";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setValue } from "../slices/userSlice";
import { Link } from "react-router-dom";
import { Button, notification, Space } from "antd";
import Loader from "../components/Loader";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const intialValues = { role: "", name: "", email: "", password: "" };
  const [formValues, setFormValues] = useState(intialValues);
  const [loading, setLoading] = useState(false);

  ////////////////////notification
  const [api, contextHolder] = notification.useNotification();
  let msg = useState("");
  const openNotificationWithIcon = (type) => {
    api[type]({
      message: msg,
    });
  };
  //////////////////////////

  // validation fields
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    //handling errors
    setFormErrors((prev) => {
      return {
        ...prev,
        [name]: "",
      };
    });

    //////////////
    const isNumber = /^[0-9]+$/.test(value);

    if (isNumber && value.length > 10) {
      setFormValues((prev) => {
        return {
          ...prev,
          email: value.slice(0, 10),
        };
      });
    } else {
      setFormValues((prev) => {
        return {
          ...prev,
          [name]: value,
        };
      });
    }
  };

  // validation
  const validate = (values) => {
    const errors = {};
    const regex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      const special = /[!@#$%^&*(),.?":{}|<>]/g
      const lowerCase = /[a-z]/g;
      const upperCase = /[A-Z]/g;
      const numbers = /[0-9]/g;

    if (!values.name) {
      errors.name = "Name required!";
    }
    if (!values.role) {
      errors.role = "Role required!";
    }

    if (!values.email) {
      errors.email = "Input required!";
    } else {
      // const ch = values.email.at(0);
      // if (ch >= "0" && ch <= "9") {
      //   if (values.email.length != 10) {
      //     errors.email = "Invalid Phn Number!";
      //   }
      // }

      const isNumber = /^[0-9]+$/.test(values.email);

      if(isNumber){
        if (values.email.length != 10) {
              errors.email = "Invalid Phn Number!";
        }
      }else {
        if (!regex.test(values.email)) {
          errors.email = "Invalid Email Address!";
        }
      }
    }

    if (!values.password) {
      errors.password = "Password required!";
    } else if (values.password.length < 6) {
      errors.password = "Password too short!";
    }    if(!values.password){
      errors.password = "Password required!";
    }else if(!values.password.match(lowerCase)){
      errors.password = "Password should contain lowercase letters!";
    }else if(!values.password.match(upperCase)){
      errors.password = "Password should contain uppercase letters!";
    }else if(!values.password.match(special)){
      errors.password = "Password should contain a special character!";
    }else if(!values.password.match(numbers)){
      errors.password = "Password should contain numbers!";
    } else if (values.password.length>15) {
      errors.password = "Password too long!";
    }

    if (Object.keys(errors).length != 0) {
      setLoading(false);
    }

    return errors;
  };

  // click on register button
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setFormErrors(validate(formValues));
    setIsSubmit(true);
  };

  // validates erros and calls the function when there is no error
  useEffect(() => {
    const setData = async () => {
      try {
        const result = await SignUp(formValues);
        if (result.status == 201) {
          msg = "Success!";
          openNotificationWithIcon("success");

          setLoading(false);

          setTimeout(() => {
            navigate("/login");
          }, 500);
        } else {
          msg = "Already Email Exists!";
          openNotificationWithIcon("warning");

          setLoading(false);
        }
      } catch (error) {
        msg = "Error While Signing Up!";
        openNotificationWithIcon("error");

        setLoading(false);
      }
    };
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      setData();
    }
  }, [formErrors]);

  return (
    <div className="register">
      {contextHolder}
      <Navbar />
      <Space>
        <Button onClick={() => openNotificationWithIcon("success")}>
          Success
        </Button>
      </Space>
      <div className="imgContainer">
        <img
          src="https://assets.burberry.com/is/image/Burberryltd/MyAccount.jpg?$BBY_V2_BASIC$&wid=1875&hei=375"
          alt=""
        />
        <span>REGISTER</span>
      </div>
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>ACCOUNT</h1>
          <div className="inputDetails">
            <input
              type="text"
              name="name"
              placeholder="Enter Your Name..."
              value={formValues.name}
              onChange={handleChange}
            />
            <p className="error">{formErrors?.name}</p>
            <input
              type="text"
              name="email"
              placeholder="Enter Email/Phn Number..."
              value={formValues.email}
              onChange={handleChange}
            />
            <p className="error">{formErrors?.email}</p>
            <input
              type="password"
              name="password"
              placeholder="Enter Your Password..."
              value={formValues.password}
              onChange={handleChange}
            />
            <p className="error">{formErrors?.password}</p>
            <RoleRadio state={{ formValues, setFormValues }} />
            <p className="error">{formErrors?.role}</p>
            {loading ? <Loader /> : <button type="submit">REGISTER</button>}
          </div>
          <div className="registerFooter">
            <span>Already Have An Account?</span>
            <Link to="/">Sign In</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
