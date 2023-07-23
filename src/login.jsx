import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Spin } from "antd";
import UsersData from "./public/utilisateurs.json";
import VirtualMachines from "./components/VirtualMachines";

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userLogged = JSON.parse(sessionStorage.getItem("user"));
    if (userLogged) {
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  const onConnexion = (values) => {
    const user = UsersData.find(
      (user) =>
        user.username === values.username && user.password === values.password
    );
    if (!user) {
      message.error("Invalid username or password");
    } else {
      setIsLoggedIn(true);
      sessionStorage.setItem("user", JSON.stringify(user));
    }
  };
  if (isLoggedIn) {
    return <VirtualMachines />;
  }
  const onConnexionFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f3f4f6",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          maxWidth: "400px",
          padding: "40px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <img
          className="mx-auto"
          src="/logo512.png"
          alt="Your Company"
          style={{
            width: "100px",
            height: "auto",
            marginBottom: "20px",
            paddingRight: "15%",
          }}
        />
        <Form
          style={{ maxWidth: "600px" }}
          name="basic"
          autoComplete="off"
          onFinish={onConnexion}
          onFinishFailed={onConnexionFailed}
        >
          <div style={{ marginBottom: "16px" }}>
            <Form.Item
              label="Nom d'utilisateur"
              name="username"
              initialValue="plusieursvm"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  outline: "none",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                  color: "#374151",
                }}
              />
            </Form.Item>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <Form.Item
              label="Mot de passe"
              name="password"
              initialValue="plusieursvm"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input
                type="password"
                style={{
                  paddingTop: "8px",
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  outline: "none",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                  color: "#374151",
                }}
              />
            </Form.Item>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: "#5727db",
                color: "#ffffff",
                fontWeight: "bold",
                padding: "8px 16px",
                borderRadius: "4px",
                outline: "none",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              Login
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
