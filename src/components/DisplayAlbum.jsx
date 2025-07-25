/* eslint-disable react/prop-types */
import { useParams } from "react-router-dom"
import { assets } from "../assets/assets"
import { PlayerContext } from "../context/PlayerContext"
import { useState, useEffect,useContext } from "react"


const DisplayAlbum = ({album}) => {

    const {id} = useParams()
    const [albumData,setAlbumdata] = useState("")
    const {playWithId, albumsData, songsData} = useContext(PlayerContext)

    useEffect(() => {
        albumsData.map((item) => {
            if(item._id === id){
                setAlbumdata(item)
            }
        })
    },[])

  return albumData ? (
    <>
        <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end">
            <img className="w-48 rounded" src={albumData.image} alt=""/>
            <div className="flex flex-col">
                <p>Playlist</p>
                <h2 className="text-5xl font-bold mb-4 md:text-7xl">{albumData.name}</h2>
                <h4>{albumData.desc}</h4>
                <p className="mt-1">
                    <img className="inline-block w-5 mb-1 mr-1 text-white" src={assets.Duke_smLogo}/>
                    <b>DukeMusic </b>
                    • 1323214 likes
                    • <b>50 songs </b>
                    • 2 hr 30 min
                </p>
            </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-white">
            <p><b className="mr-4">#</b>Title</p>
            <p></p>
            <p></p>
            <img className="m-auto w-4" src={assets.clock_icon} alt=""/>
        </div>
        <hr/>
        {
            songsData.filter((item) => item.albumId === album._id ).map((item, index) => (
                <div onClick={() => playWithId(item._id)} key={index} className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 items-center text-[#a7a7a7] hover:bg[#ffffff2b] cursor-pointer">
                    <p className="text-white">
                        <b className="mr-4 text-white">{index+1}</b>
                        <img className="inline w-10 mr-5" src={item.image} alt=""/>
                        {item.name}
                    </p>
                    <p></p>
                    <p></p>
                    <p className="text-[15px] text-center">{item.duration}</p>
                </div>
            ))
        }
    </>
  ) : null
}

export default DisplayAlbum