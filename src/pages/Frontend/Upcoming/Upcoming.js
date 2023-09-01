import React, { useEffect, useState } from 'react'
import { Col, Empty, Row, Spin, message } from 'antd'
import { CiMenuKebab } from 'react-icons/ci';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../../config/firebase';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

import { useAuthContext } from '../../../contexts/AuthContext';
import dayjs from 'dayjs';




export default function Hero() {
  const { user } = useAuthContext()
  const [allDocuments, setAllDocuments] = useState([])
  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [lists, setLists] = useState([])

  const today = dayjs().format("YYYY-MM-DD");
  // Read Todo
  const getTodo = async () => {

    const q = query(collection(firestore, "todos"), where("date", ">", today));

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
  }, [user])

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
      {
        documents == "" ? <Empty /> :
          <Row>
            {documents.map((todo, i) => {
              return (
                <Col key={i} className='m-2'>
                  <div className='card p-3 ' style={{ width: 200, height: 200, overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between", backgroundColor: `${todo.bgColor}`, border: "1 solid dark", borderRadius: 5 }}>
                    <div className="carFirtDiv">
                      <div className='dropdownKebab'>
                        <div className="btn-group">
                          <span className='fs-5 menukebab' data-bs-toggle="dropdown" aria-expanded="false"><CiMenuKebab /></span>
                          <ul className="dropdown-menu ">
                            {/* <li className='dropdown-item' style={{ display: "flex", alignItems: "center" }}><EditOutlined style={{ display: "flex", alignItems: "center", marginRight: "5px" }} /> Edit</li> */}
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

          </Row >
      }
    </>
  )
}


