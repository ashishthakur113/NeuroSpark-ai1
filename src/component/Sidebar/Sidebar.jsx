import { useContext, useState } from 'react'
import './Sidebar.css'
import { IoMenuSharp } from "react-icons/io5";
import { IoIosAdd } from "react-icons/io";
import { FaRegMessage } from "react-icons/fa6";
import { Context } from "../../context/Context"
export default function Sidebar() {

  const [extend, setExtend] = useState(false);
  const { prevPrompts, onSent, setRecentPrompt, newChat} = useContext(Context)
  const loadPrompt = async(prompt)=>{
    setRecentPrompt(prompt)
    await onSent(prompt)
  }

  return (
    <div className='sidebar'>
      <div className="top">
        <IoMenuSharp className='img menu' onClick={() => setExtend(prev => !prev)} />
        <div className="newchat" onClick={()=>newChat()}>
          <IoIosAdd className='img' />
          {extend ? <p>New Chat</p> : null}
        </div>
        {extend ? <div className="recent">
          <p className="recent-title">Recent</p>
          {prevPrompts.map((item, index) => {
            return (
              <div className="recent-entry"  onClick={()=>loadPrompt(item)}>
                <FaRegMessage className='img' />
                <p>{item.slice(0,16)} ...</p>
              </div>
            )
          })}

        </div> : null}

      </div>
    </div>
  )
}
