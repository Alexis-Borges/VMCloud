import React, { useEffect, useState } from "react";
import axios from "axios";

const VirtualMachines = () => {
  const [vmInfo, setVmInfo] = useState({
    publisher: "Canonical",
    offer: "UbuntuServer",
    sku: "18.04-LTS",
  });

  const [vmOptions, setVmOptions] = useState([]);
  const [isCreatingVm, setIsCreatingVm] = useState(false);
  const [isVmCreated, setIsVmCreated] = useState(false);
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userLogged = JSON.parse(sessionStorage.getItem("user"));
    const vmCreated = JSON.parse(sessionStorage.getItem("vm"));
    if (vmCreated) {
      if (new Date() > new Date(vmCreated.deleteDate)) {
        sessionStorage.removeItem("vm");
        setIsVmCreated(false);
        window.location.reload();
      }
      setIsVmCreated(vmCreated);
    }
    setUser(userLogged);
    if (userLogged.username === "plusieursvm") {
      setVmOptions([
        { value: "ubuntu", label: "Ubuntu 18.04" },
        { value: "centos", label: "CentOS 7" },
        { value: "windows", label: "Debian 9" },
      ]);
    }
    setIsLoading(false);
  }, []);

  const handleChange = (value) => {
    const selectedVmOption = vmOptions.find((option) => option.value === value);
    if (selectedVmOption) {
      setVmInfo({
        ...vmInfo,
        publisher: selectedVmOption.publisher,
        offer: selectedVmOption.offer,
        sku: selectedVmOption.sku,
      });
    }
  };

  const handleCreateVm = () => {
    setIsCreatingVm(true);
    try {
      axios
        .post(`http://localhost:3001/create-vm`, vmInfo)
        .then((res) => {
          setIsCreatingVm(false);
          setIsVmCreated(res.data);
          sessionStorage.setItem("vm", JSON.stringify(res.data));
        })
        .catch((error) => {
          console.log("error :>> ", error);
          setIsCreatingVm(false);
        });
    } catch (error) {
      console.log("error :>> ", error);
      setIsCreatingVm(false);
    }
  };

  if (isVmCreated) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "16px",
          backgroundColor: "#f3f4f6",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            maxWidth: "800px",
            padding: "40px",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "24px",
              textAlign: "center",
              marginLeft: "16px",
            }}
          >
            VM created successfully
          </h2>
          <p
            style={{
              textAlign: "center",
              marginBottom: "16px",
              marginLeft: "16px",
            }}
          >
            IP: {isVmCreated.ip}
          </p>
          <p
            style={{
              textAlign: "center",
              marginBottom: "16px",
              marginLeft: "16px",
            }}
          >
            Username: {isVmCreated.username}
          </p>
          <p
            style={{
              textAlign: "center",
              marginBottom: "16px",
              marginLeft: "16px",
            }}
          >
            Password: {isVmCreated.password}
          </p>
          <p
            style={{
              textAlign: "center",
              marginBottom: "16px",
              marginLeft: "24px",
            }}
          >
            (the VM will be suppressed at{" "}
            {new Date(isVmCreated.deleteDate).toLocaleTimeString()})
          </p>
          <button
            type="button"
            style={{
              backgroundColor: "#5727db",
              color: "#ffffff",
              fontWeight: "bold",
              marginLeft: "16px",
              padding: "8px 16px",
              borderRadius: "4px",
              outline: "none",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
            onClick={() => {
              sessionStorage.removeItem("user");
              window.location.href = "/";
            }}
          >
            Logout
          </button>
          {user.username === "plusieursvm" && (
            <button
              type="button"
              style={{
                backgroundColor: "#5727db",
                color: "#ffffff",
                fontWeight: "bold",
                padding: "8px 16px",
                marginLeft: "20px",
                borderRadius: "4px",
                outline: "none",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
              onClick={() => {
                sessionStorage.removeItem("vm");
                setIsVmCreated(false);
                window.location.reload();
              }}
            >
              Create another VM
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "20px",
        backgroundColor: "#f3f4f6",
      }}
    >
      {!isCreatingVm ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            maxWidth: "400px",
            padding: "60px",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "24px",
              textAlign: "center",
              marginRight: "25px",
            }}
          >
            Choose The Operating System
          </h2>
          <select
            value={vmInfo.offer}
            onChange={(e) => handleChange(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              outline: "none",
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
              color: "#374151",
            }}
          >
            {vmOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            style={{
              backgroundColor: "#5727db",
              color: "#ffffff",
              fontWeight: "bold",
              padding: "8px 16px",
              borderRadius: "4px",
              outline: "none",
              marginLeft: "20px",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              marginTop: "16px",
            }}
            onClick={handleCreateVm}
          >
            Create a VM
          </button>
          <br />
          <br />
          <button
            type="button"
            style={{
              backgroundColor: "#5727db",
              color: "#ffffff",
              fontWeight: "bold",
              padding: "8px ",
              borderRadius: "4px",
              marginLeft: "10px",
              outline: "none",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              marginTop: "20px",
            }}
            onClick={() => {
              sessionStorage.clear();
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </div>
      ) : (
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
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "24px",
              textAlign: "center",
            }}
          >
            Creating your VM
          </h2>
          <p
            style={{
              textAlign: "center",
              marginBottom: "16px",
              marginLeft: "20px",
            }}
          >
            It may take up to 6 minutes
          </p>
        </div>
      )}
    </div>
  );
};

export default VirtualMachines;
