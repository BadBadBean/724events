import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [last, setLast] = useState(null);

  const getData = useCallback(async () => {
    try {
      const fetchedData = await api.loadData();
      setData(fetchedData);

      // Récupérer l'évènement le plus récent
      if (fetchedData && fetchedData.events) {
        const sortedEvents = fetchedData.events.sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        setLast(sortedEvents[0]);
      }
    } catch (err) {
      setError(err);
    }
  }, []);

  useEffect(() => {
    if (data) return;
    getData();
  }, [data, getData]);
  
  // Utiliser useMemo pour effectuer un rendu uniquement lorsque les valeurs changent
  const contextValue = useMemo(() => ({
    data,
    error,
    last,
  }), [data, error, last]);

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useData = () => useContext(DataContext);

export default DataContext;
