import { useEffect, useState } from "react";
import { getTaskAnalytics, getTasks } from "../api/taskApi";
import { addPersons, getPeople, getUser } from "../api/userApi";
import { AppContext } from "./AppContext";
import { toast } from "react-toastify";

const AppProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [filter, setFilter] = useState("This Week");
  const [loading, setLoading] = useState(false);
  const [people, setPeople] = useState([]);
  const [user, setUser] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const taskData = await getTasks(filter);
      // console.log(taskData);
      setTasks(taskData);
      setLoading(false);
    } catch (error) {
      console.log("error: ", error.message);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const analyticsData = await getTaskAnalytics();
      setAnalytics(analyticsData);
      setLoading(false);
    } catch (error) {
      console.log("error: ", error.message);
    }
  };

  const fetchPeople = async () => {
    try {
      const response = await getPeople();
      // console.log("Fetched people:", response);
      if (Array.isArray(response.people)) {
        setPeople(response.people);
      } else {
        console.log("Fetched data is not an array");
      }
    } catch (error) {
      console.log("Error fetching people:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const userData = await getUser();
      setUser(userData);
    } catch (error) {
      console.log("error: ", error.message);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await fetchTasks();
    await fetchAnalytics();
    await fetchPeople();
    await fetchUser();
    setLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchData();
    }
  }, [filter]);

  const addPerson = async (email) => {
    // console.log("Adding person with email:", email, people);
    if (people.includes(email)) {
      toast.warn("This email is already added", {
        position: "bottom-right",
        theme: "dark",
      });
      return false;
    } else {
      try {
        const response = await addPersons(email);
        if (response) {
          setPeople((prevPeople) => [...prevPeople, email]);
          // console.log("response:", response, "people: ", people);
          return true;
        } else {
          console.log("Failed to add person");
          return false;
        }
      } catch (error) {
        console.error("Error adding person:", error);
        return false;
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        tasks,
        analytics,
        filter,
        setFilter,
        loading,
        setLoading,
        people,
        addPerson,
        fetchAnalytics,
        fetchTasks,
        fetchPeople,
        fetchData,
        user,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
