import React from 'react';
import { FaTrash, FaPen, FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { IUser } from './interfaces/IUser';

const phoneRegExp = /^[0-9]{8,11}\w+/
const AddNewUserSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name is too short!')
    .max(50, 'Name is too long!')
    .required('Name is required')
    .matches(/^[aA-öÖ\s]+$/, "Only alphabets are allowed"),
  email: Yup.string().email('Invalid email').required("Email is required"),
  phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid').required("Phone number is required")
});

const USER_API_URL = "https://randomuser.me/api/?results=20&nat=fi";
function App(props: any) {
  const [currentlySortedRow, setCurrentlySortedRow] = React.useState<string>("name");
  const [sortedByAsc, setSortedByAsc] = React.useState<boolean>(true);
  const [users, setUsers] = React.useState<IUser[]>([]);
  const [editUserId, setEditUserId] = React.useState<number>(-1);
  React.useEffect(() => {
    fetch(USER_API_URL).then((r) => r.json()).then(response => {
      setUsers(response?.results?.map((user: any, index: number) => {
        return {
          id: index,
          name: `${user?.name?.first} ${user?.name?.last}`,
          email: `${user?.email}`,
          phone: `${user?.phone}`,
        } as IUser
      }));
    })
  }, []);

  const deleteUser = (id: number) => {
    if (window.confirm("Are you sure you want to delete an user?"))
      setUsers(users.filter(user => user.id !== id));
  }

  function sortBy(columnName: string): void {
    let sortedUsers = [...users].sort((a: any, b: any) =>
      sortedByAsc ?
        a[columnName].localeCompare(b[columnName]) :
        b[columnName].localeCompare(a[columnName]));

    setSortedByAsc(!sortedByAsc);
    setCurrentlySortedRow(columnName);
    setUsers(sortedUsers)
  }

  return (
    <div className="appContainer">
      <div className="header">
        <div className="headerLogo">
          <img alt="website logo" src="https://via.placeholder.com/32/ffffff/808080"></img>
        </div>
        <div className="headerText">lord Software</div>
      </div>

      <div className="mainContent">
        <h2 className="pageTitle">List of participants</h2>
        <div className="addUserContainer">
          <Formik
            initialValues={{ id: 0, name: "", email: "", phone: "" } as IUser}
            validationSchema={AddNewUserSchema}
            onSubmit={(user: IUser) => {
              console.log("asdasddas")
              setUsers([user, ...users])
            }}
          >
            {({
              errors,
              handleChange
            }: any) => (
              <Form className="row">
                <div className="formFieldDiv">
                  <Field id="addUserNameField" style={{ width: 160 }} className={errors.name ? "invalidInput" : ""}  onChange={handleChange} type="text" name="name" placeholder="Full name" />
                  <ErrorMessage name="name" component="div" />
                </div>
                <div className="formFieldDiv">
                  <Field id="addUserEmailField" style={{ width: 230 }} className={errors.email ? "invalidInput" : ""} onChange={handleChange} type="email" name="email" placeholder="E-mail address" />
                  <ErrorMessage name="email" component="div" />
                </div>
                <div className="formFieldDiv">
                  <Field id="addUserPhoneField" onChange={handleChange} className={errors.phone ? "invalidInput" : ""}  type="tel" name="phone" placeholder="Phone number" />
                  <ErrorMessage name="phone" component="div" />
                </div>
                <button id="addNewUserBtn" type="submit" className="basicButton">Add new</button>
              </Form>
            )}
          </Formik>
        </div>

        <div className="userTableContainer">
          <table className="userTable">
            <thead>

              <tr className="sortRow">
                <th style={{ width: 140 }} onClick={() => sortBy("name")}>Name
                  {currentlySortedRow === "name" && (sortedByAsc ? <FaArrowDown /> : <FaArrowUp />)}
                </th>
                <th style={{ width: 215 }} onClick={() => sortBy("email")}>E-mail address
                  {currentlySortedRow === "email" && (sortedByAsc ? <FaArrowDown /> : <FaArrowUp />)}
                </th>
                <th style={{ width: 180 }} onClick={() => sortBy("phone")}>Phone number
                  {currentlySortedRow === "phone" && (sortedByAsc ? <FaArrowDown /> : <FaArrowUp />)}
                </th>
              </tr>
            </thead>
            <tbody>

              {
                users?.map((user, index) => {
                  if (editUserId === user.id) {
                    return (
                      <tr key={index}>
                        <Formik
                          initialValues={user}
                          validationSchema={AddNewUserSchema}
                          onSubmit={(usr: IUser) => {
                            setUsers([...users.map((u) => u.id === usr.id ? usr : u)]);
                            setEditUserId(-1);
                          }}
                        >
                          {({
                            values,
                            errors,
                            handleChange
                          }: any) => (
                            <>
                              <td>
                                <Field style={{ width: 140 }} className={errors.name ? "invalidInput editUserName" : "editUserName"} onChange={handleChange} type="text" name="name" placeholder="Full name" />
                              </td>
                              <td>
                                <Field style={{ width: 235 }} className={errors.email ? "invalidInput editUserEmail" : "editUserEmail"} onChange={handleChange} type="email" name="email" placeholder="E-mail address" />
                              </td>
                              <td>
                                <Field style={{ width: 180 }}  className={errors.phone ? "invalidInput editUserPhone" : "editUserPhone"} onChange={handleChange} type="tel" name="phone" placeholder="Phone number" />
                              </td>
                              <td className="iconTd" colSpan={2}>
                                <button style={{gap: 10}} onClick={() => setEditUserId(-1)} className="basicButton cancel">Cancel</button>
                                <Form>
                                  <button type="submit" className="basicButton save">Save</button>
                                </Form>
                              </td>
                            </>
                          )}
                        </Formik>
                      </tr>
                    )
                  };

                  return (
                    <tr key={index}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td className="iconTd" colSpan={2}>
                        <FaPen className="editIcon" onClick={() => setEditUserId(user.id)} size="18" color="#909090" />
                        <FaTrash id="deleteIcon" onClick={() => deleteUser(user.id)} size="18" color="#909090" />
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>


      </div>

    </div >
  );
}

export default App;