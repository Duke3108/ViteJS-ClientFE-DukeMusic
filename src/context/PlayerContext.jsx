/* eslint-disable react/prop-types */
import { createContext, useEffect, useRef, useState } from "react";
import axios from 'axios'
export const PlayerContext = createContext()

const PlayerContextProvider = (props) => {

    const audioRef = useRef()
    const seekBg = useRef()
    const seekBar = useRef()

    const url = 'http://localhost:4000'

    const [songsData, setSongsData] = useState([])
    const [albumsData, setAlbumsData] = useState([])
    const [artistsData, setArtistsData] = useState([])
    const [track, setTrack] = useState(songsData[0])
    const [playStatus, setPlayStatus] = useState(false)
    const [time, setTime] = useState({
        currentTime:{
            second:0,
            minute:0
        },
        totalTime: {
            second:0,
            minute:0
        }
    })

    const play = () => {
        audioRef.current.play()
        setPlayStatus(true)
    }

    const pause = () => {
        audioRef.current.pause()
        setPlayStatus(false)
    }

    const playWithId = async (id) => {
        await songsData.map((item) => {
            if(id === item._id){
                setTrack(item)
            }
        })

        await audioRef.current.play()
        setPlayStatus(true)
    }

    const previous = async () => {
        songsData.map(async (item,index) => {
            if(track._id === item._id && index > 0){
                await setTrack(songsData[index-1])
                await audioRef.current.play()
                setPlayStatus(true)
            }
        })
    }

    const next = async () => {
        songsData.map(async (item,index) => {
            if(track._id === item._id && index < songsData.length){
                await setTrack(songsData[index+1])
                await audioRef.current.play()
                setPlayStatus(true)
            }
        })
    }

    const seekSong = async (e) => {
        audioRef.current.currentTime = ((e.nativeEvent.offsetX / seekBg.current.offsetWidth)*audioRef.current.duration)
    }

    const getSongsData = async () => {
        try {
            const response = await axios.get(`${url}/api/song/list`)
            setSongsData(response.data.songs)
            setTrack(response.data.songs.songs[0])
        } catch (error) {
            console.log(error)
        }
    }

    const getAlbumsData = async () => {
        try {
            const response = await axios.get(`${url}/api/album/list`)
            setAlbumsData(response.data.albums)
        } catch (error) {
            console.log(error)
        }
    }

    const getArtistData = async () => {
        try {
            const response = await axios.get(`${url}/api/artist/`)
            setArtistsData(response.data.artists)
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        setTimeout(() => {
            audioRef.current.ontimeupdate = () => {
                seekBar.current.style.width = (Math.floor(audioRef.current.currentTime/audioRef.current.duration * 100))+'%'
                setTime({
                    currentTime:{
                        second: Math.floor(audioRef.current.currentTime % 60),
                        minute: Math.floor(audioRef.current.currentTime / 60)
                    },
                    totalTime: {
                        second: Math.floor(audioRef.current.duration % 60),
                        minute: Math.floor(audioRef.current.duration / 60)
                    }
                })
            }
        },1000)
    },[audioRef])

    useEffect(() => {
        getSongsData()
        getAlbumsData(),
        getArtistData()
    },[])

    const contextValue = {
        audioRef,
        seekBar,
        seekBg,
        track, setTrack,
        playStatus, setPlayStatus,
        time, setTime,
        play,pause,
        playWithId,
        previous,next,
        seekSong,
        songsData,albumsData,artistsData
    }

    return (
        <PlayerContext.Provider value={contextValue}>
            {props.children}
        </PlayerContext.Provider>
    )
}

export default PlayerContextProvider