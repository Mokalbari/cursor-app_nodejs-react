import { Cursor } from "../components/cursor";

/* eslint-disable */
export const renderCursors = (users: any) => {
  return Object.keys(users).map((uuid) => {
    const user = users[uuid];

    return <Cursor key={uuid} point={[user.state.x, user.state.y]} />;
  });
};
