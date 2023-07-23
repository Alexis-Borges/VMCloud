import React, { useEffect, useState } from "react";
import axios from "axios";

const VM = () => {
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
        { value: "centos", label: "CentOS 7.5" },
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isVmCreated) {
    return (
      <div>
        <h2>VM created!</h2>
        <p>IP: {isVmCreated.ip}</p>
        <p>Username: {isVmCreated.username}</p>
        <p>Password: {isVmCreated.password}</p>
        <p>
          Enjoy! (the session will end at{" "}
          {new Date(isVmCreated.deleteDate).toLocaleTimeString()})
        </p>
        <button
          type="button"
          onClick={() => {
            sessionStorage.removeItem("user");
            window.location.href = "/";
          }}
        >
          Logout
        </button>
        {user.username === "userManyVM" && (
          <button
            type="button"
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
    );
  }

  return (
    <div>
      {!isCreatingVm ? (
        <div>
          <h2>Choose your VM</h2>
          <select
            value={vmInfo.offer}
            onChange={(e) => handleChange(e.target.value)}
          >
            {vmOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button type="button" onClick={handleCreateVm}>
            Create VM
          </button>
          <br />
          <br />
          <button
            type="button"
            onClick={() => {
              sessionStorage.clear();
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div>
          <h2>Creating your VM</h2>
          <p>It may take up to 10 minutes</p>
        </div>
      )}
    </div>
  );
};

export default VM;
