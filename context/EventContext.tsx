import { View, Text } from "react-native";
import React, { createContext, useContext, useEffect, useState } from "react";
import usePersistedState from "../util/PersistedState";
import axios from "axios";
import { AuthContext } from "./AuthContext";

const EventContext = createContext<any>({
  events: [],
  getEvents: () => {},
  setEvents: () => {},
  registerEvent: () => {},
  unregisterEvent: () => {},
  refreshing: false,
  onRefresh: () => {},
  getRegisteredEvents: () => {},
  registeredEvents: [],
  setRegisteredEvents: () => {},
});

function EventProvider({ children }: { children: React.ReactNode }) {
  const { user } = useContext<any>(AuthContext);
  const [events, setEvents] = usePersistedState("events", []);
  const [registeredEvents, setRegisteredEvents] = usePersistedState(
    "registeredEvents",
    []
  );
  const [refreshing, setRefreshing] = useState(false);

  const GetEvents = async () => {
    try {
      console.log("fetching events.....");
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/events`
      );

      if (user?.email) {
        await getRegisteredEvents();
      }

      if (response.status === 200) {
        setEvents(response.data.data);
        if (events.length > 0) {
          console.log(events);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await GetEvents();
    setRefreshing(false);
  };

  const getRegisteredEvents = async () => {
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/event/registered/${user?.email}`
      );
      if (response.status === 200) {
        setRegisteredEvents(response.data.data);
        console.log("Registered events fetched successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const registerEvent = async (eventId: string) => {
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/event/register`,
        {
          eventId: eventId,
          u_email: user?.email,
        }
      );
      if (response.status === 201) {
        console.log("Event registered successfully");
        await getRegisteredEvents();
      }
      return { status: response.status };
    } catch (error) {
      console.log(error);
    }
  };

  const unregisterEvent = async (eventId: string) => {
    try {
      const response = await axios.delete(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/event/unregister/${user?.email}`,
        {
          data: { eventId: eventId },
        }
      );
      if (response.status === 200) {
        console.log("Event unregistered successfully");
        await getRegisteredEvents();
      }
      return { status: response.status };
    } catch (error) {
      console.log(error);
    }
  };

  const value = {
    events: events,
    getEvents: GetEvents,
    registerEvent: registerEvent,
    unregisterEvent: unregisterEvent,
    setEvents: setEvents,
    refreshing: refreshing,
    onRefresh: onRefresh,
    getRegisteredEvents: getRegisteredEvents,
    registeredEvents: registeredEvents,
    setRegisteredEvents: setRegisteredEvents,
  };

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
}

export { EventContext, EventProvider };
export default EventProvider;
