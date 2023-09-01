import React, { useEffect, useState } from 'react'
import { Col, DatePicker, Form, Input, Modal, Row, message, ColorPicker, Select, Spin, Button, } from 'antd'
import { FaPlus } from 'react-icons/fa';
import { CiMenuKebab } from 'react-icons/ci';
import { collection, deleteDoc, doc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { firestore } from '../../../config/firebase';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import dayjs from 'dayjs';
import { useAuthContext } from "../../../contexts/AuthContext"





const initialValue = {
  title: "",
  date: "",
  list: "",
  description: "",
}

export default function Hero() {
  const { user } = useAuthContext()

  const [openModal, setOpenModal] = useState(false)
  const [updateModal, setUpdateModal] = useState(false)
  const [state, setState] = useState(initialValue)
  const [allDocuments, setAllDocuments] = useState([])
  const [documents, setDocuments] = useState([])
  const [lists, setLists] = useState([])
  const [selectedColor, setSelectedColor] = useState({});
  const [isLoading, setIsLoading] = useState(true)




  const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

  const handleDate = (_, date) => setState(s => ({ ...s, date }))

  // get List
  const getList = async () => {
    const querySnapshot = await getDocs(collection(firestore, "lists"));
    const array = []
    querySnapshot.forEach((doc) => {
      let data = doc.data()
      array.push(data)
    });
    setLists(array)

  }

  useEffect(() => {
    getList()
  }, [])

  // Add Todo Function

  const handleSubmit = async (e) => {
    e.preventDefault();
    let { title, date, list, description, } = state;
    const todo = {
      title,
      date,
      list,
      description,
      dateCreated: serverTimestamp(),
      id: Math.random().toString(36).slice(2),
      bgColor: selectedColor,
    };
    todo.createdBy = {
      email: user.email,
      uid: user.uid
    }
    setState(initialValue)
    creatDocument(todo);

  };


  const creatDocument = async (todo) => {
    try {
      await setDoc(doc(firestore, "todos", todo.id), todo);
      message.success("Add Todo Successfully.");
      setOpenModal(false);
    } catch (error) {
      message.error("Something Went Wrong While Adding Todo");
      console.error("Error", error);
    }
  };
  // Read Todo
  const getTodo = async () => {
    const q = query(collection(firestore, "todos"), where("createdBy.uid", "==", user.uid));
    const querySnapshot = await getDocs(q);
    const array = []
    querySnapshot.forEach((doc) => {
      let data = doc.data()
      array.push(data)
    }); setDocuments(array)
    setAllDocuments(array)
    setIsLoading(false)
  }

  useEffect(() => {
    getTodo()
  }, [getTodo])

  useEffect(() => {
    const filteredDocuments = allDocuments.filter(todo => todo.list === lists)
    setDocuments(filteredDocuments)
  }, [])

  // Delete Todo
  const handleDelete = async (todo) => {
    try {
      await deleteDoc(doc(firestore, "todos", todo.id));
      let deleteDocuments = documents.filter(doc => doc.id !== todo.id)
      setDocuments(deleteDocuments)
      setAllDocuments(deleteDocuments)
      message.success("Todo Delete Successfully.")
    } catch (error) {
      message.error("Someting worng while delete Todo")
      console.log("error", error)
    }
  }

  const handleUpdate = async () => {
    const updatedTodo = {
      ...state,
      bgColor: selectedColor,
    };

    try {
      await setDoc(doc(firestore, "todos", updatedTodo.id), updatedTodo);
      // Update the local todos list
      const updatedDocuments = documents.map((doc) =>
        doc.id === updatedTodo.id ? updatedTodo : doc
      );
      setDocuments(updatedDocuments);
      setAllDocuments(updatedDocuments);
      message.success("Todo Updated Successfully.");
    } catch (error) {
      message.error("Something Went Wrong While Updating Todo");
      console.error("Error", error);
    }
    setUpdateModal(false);
  };

  if (isLoading) {
    return (
      <div className='text-center'>

        <Spin style={{ marginTop: "50px" }} tip="Loading" size="small">
          <div className="content" />
        </Spin>

      </div>
    )
  }

  return (
    <>

      <Row>
        {documents.map((todo, i) => {
          return (
            <Col key={i} className='m-2'>
              <div className='card p-3 border-0 ' style={{ width: 200, height: 200, overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between", backgroundColor: `${todo.bgColor}`, border: "1 solid dark", borderRadius: 5 }}>
                <div className="carFirtDiv">
                  <div className='dropdownKebab'>
                    <div className="btn-group">
                      <span className='fs-5 menukebab' data-bs-toggle="dropdown" aria-expanded="false"><CiMenuKebab /></span>
                      <ul className="dropdown-menu ">
                        <li className='dropdown-item' style={{ display: "flex", alignItems: "center" }} onClick={() => { setState(todo); setUpdateModal(true); setSelectedColor(todo.bgColor) }} ><EditOutlined style={{ display: "flex", alignItems: "center", marginRight: "5px" }} /> Edit</li>
                        <li className='dropdown-item' style={{ display: "flex", alignItems: "center", }} onClick={() => handleDelete(todo)} ><DeleteOutlined style={{ display: "flex", alignItems: "center", marginRight: "5px" }} />Delet</li>
                      </ul>
                    </div>
                  </div>

                  <h5 >{todo.title}</h5><br />
                  <span className='fw-bold'>{todo.list}</span>
                  <p>{todo.description}</p>

                </div>
                <div>
                  <p className='mb-0'>{todo.date ? dayjs(todo.date).format("dddd, DD/MM/YYYY") : ""}</p>
                </div>
              </div>
            </Col>
          )
        })}
        <Col className='m-2'>
          <div className='card p-5 ' style={{ width: 200, height: 200, backgroundColor: "#f5f5f5", border: "none" }} >
            <span id='pluseCard' style={{ display: 'flex', justifyContent: "center", paddingTop: "30px" }} onClick={() => setOpenModal(true)}>
              <FaPlus size={40} />
            </span>
          </div>
        </Col>
      </Row >


      <Modal
        title="Add Todo"
        centered
        open={openModal}
        onCancel={() => setOpenModal(false)}

        footer={[

          <Button key="submit" type="primary" onClick={handleSubmit}>
            Add
          </Button>,

        ]}
      >
        <Form layout="vertical" className='py-4'>
          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Form.Item label="Title"

              // rules={[
              //   {
              //     required: true,
              //     message: "Enter your title."
              //   },
              //   { whitespace: true },
              //   { min: 3 }
              // ]}
              >
                <Input placeholder='Input your title' name='title' onChange={handleChange} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item label="Date">
                <DatePicker className='w-100' name='date' onChange={handleDate} />
              </Form.Item>

            </Col>
            <Col xs={24} lg={12}>
              <Form.Item label="list">
                <Select value={state.list} onChange={list => setState(s => ({ ...s, list }))}>
                  {["Personal", "Work"].map((list, i) => {
                    return <Select.Option key={i} value={list}>{list}</Select.Option>
                  })}
                </Select>


              </Form.Item>

            </Col>
            <Col xs={24} lg={12}>
              <Form.Item label="Color">
                <ColorPicker value={selectedColor} onChange={(e, color) => setSelectedColor(color)} />
              </Form.Item>

            </Col>
            <Col span={24}>
              <Form.Item label="Description" className='mb-0'>
                <Input.TextArea placeholder='Input your description' name='description' onChange={handleChange} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal >

      <Modal
        title="Update Todo"
        centered
        open={updateModal}
        onCancel={() => setUpdateModal(false)}

        footer={[

          <Button key="submit" type="primary" onClick={handleUpdate}>
            Update
          </Button>,

        ]}
      >
        <Form layout="vertical" className='py-4'>
          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Form.Item label="Title">
                <Input placeholder='Input your title' name='title' value={state.title} onChange={handleChange} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item label="Date">
                <DatePicker className='w-100' name='date' value={state.date ? dayjs(state.date) : ""} onChange={handleDate} />
              </Form.Item>

            </Col>
            <Col xs={24} lg={12}>
              <Form.Item label="list">
                <Select value={state.list} onChange={list => setState(s => ({ ...s, list }))}>
                  {["Personal", "Work"].map((list, i) => {
                    return <Select.Option key={i} value={list}>{list}</Select.Option>
                  })}
                </Select>


              </Form.Item>

            </Col>
            <Col xs={24} lg={12}>
              <Form.Item label="Color">
                <ColorPicker value={state.bgColor} onChange={(e, color) => setSelectedColor(color)} />
              </Form.Item>

            </Col>
            <Col span={24}>
              <Form.Item label="Description" className='mb-0'>
                <Input.TextArea placeholder='Input your description' value={state.description} name='description' onChange={handleChange} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal >
    </>
  )
}














// <Select value={state.list} onChange={list => setState(s => ({ ...s, list }))}>
//   {lists.map((list, i) => {
//     return (
//       <div key={i} >
//         <Link to={`/list${list.key}`}>
//           <li className='list-group-item bg-light my-1 rounded'>
//             <Badge color={list.color} text={list.title} />
//           </li>
//         </Link>
//       </div>
//     )
//   })}
// </Select>