import express from "express"
import { supabase } from "../utils/supabase";

export const playlistRouter = express.Router();

playlistRouter.get("/get-playlist", async (req, res) => {
  try{
    const userId = req.user.id;
    const { data: playlist, error } = await supabase.from("playlists").select("*").eq("user_id", userId);
    if(error) return res.status(500).json({ message:"Error fetching playlist", error });
    if(!playlist || playlist.length == 0) return res.status(404).json({ message:"No playlists found for this user" });
    return res.status(200).json({ playlist });
  } catch(err){
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

playlistRouter.post("/create-playlist", async (req, res) => {
  const { name, coverImage } = req.body;
  if(!name || !coverImage) return res.status(400).json({ message: "Name and cover image are required"});
  try{
    const userId = req.user.id;
    const { data, error } = await supabase.from("playlists").insert([{
      name: name,
      cover_image: coverImage,
      user_id: userId,
      playlist_id: userId+Date.toString(),
    },]);
    if(error) return res.status(500).json({ message: "Error creating playlist"});
    return res.status(200).json({ message: "Playlist created successfully", playlist:data[0] });
  } catch(err){
    return res.status(200).json({ message: "Server error", error: err.message});
  }
});

export { playlistRouter };