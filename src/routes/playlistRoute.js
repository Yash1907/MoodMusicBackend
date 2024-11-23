import express from "express"
import { supabase } from "../utils/supabase.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

export const playlistRouter = express.Router();

playlistRouter.get("/get-playlist", authMiddleware, async (req, res) => {
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

playlistRouter.post("/create-playlist", authMiddleware, async (req, res) => {
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

playlistRouter.put("/update-playlist/:id", authMiddleware, async(req, res) => {
  const playlist_id = req.params.id;
  const { name, coverImage } = req.body;

  if(!name && !coverImage){
    return res.status(400).json({ message: "At least one of the name or cover image is required to update the playlist" });
  }
  try{
    const userId = req.user.id;
    const {data: playlist, error: error} = await supabase.from("playlists").select("*").eq("playlist_id", playlist_id).eq("user_id", user_id).single();
    if(error) return res.status(500).json({ message: "Error fetching playlists", error:error });
    if(!playlist) return res.status(404).json({message: "Playlist not found"});
    
    const updateData = {};
    if(name) updateData.name = name;
    if(coverImage) updateData.cover_image = coverImage;

    const { data: updatedPlaylist, error: updateError } = await supabase.from("playlists").update(updateData).eq("playlist_id", playlistId).eq("user_id", userId);
    if(updateError) return res.status(500).json({ message: "Error updating playlist", error: updateError});
    return res.status(200).json({ message: "Playlist updated successfully", playlist: updatedPlaylist[0] });
  }
  catch(err){
    return res.send(500).json({ message: "Server error", error:err.message });
  }
});

playlistRouter.delete("/delete-playlist/:id", authMiddleware, async(req, res) => {
  const playlistId = req.params.id;
  try{
    const userId = req.user.id;
    const { data: playlist, error: error } = await supabase.from("playlists").select("*").eq("playlist_id",playlistId).eq("user_id",userId).single();
    if(error) return res.status(500).json({ message:"Error fetching playlist",error:error });
    if(!playlist) return res.status(404).json({ message:"Playlist not found" });
    const { error: deleteError } = await supabase.from("playlists").delete().eq("playlist_id",playlistId).eq("user_id",userId);
    if(deleteError) return res.send(500).json({ message:"Error deleting playlist", error:deleteError });
    return res.status(200).json({ message:"Playlist deleted successfully" });
  } catch(err){
    return res.status(500).json({ message:"Server error", error:err.message });
  }
});