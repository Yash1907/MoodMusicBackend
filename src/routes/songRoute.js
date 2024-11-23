import express from "express";
import { supabase } from "../utils/supabase.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

export const songRouter = express.Router();

// Get all songs in a playlist
songRouter.get("/get-songs/:playlistId", authMiddleware, async (req, res) => {
  const playlistId = req.params.playlistId; // Playlist ID from the URL
  try {
    const userId = req.user.id;
    // Fetch songs that belong to the playlist and the user
    const { data: songs, error } = await supabase
      .from("songs")
      .select("*")
      .eq("playlist_id", playlistId)
      .eq("user_id", userId);

    if (error) {
      return res.status(500).json({ message: "Error fetching songs", error });
    }

    if (!songs || songs.length === 0) {
      return res.status(404).json({ message: "No songs found for this playlist" });
    }

    return res.status(200).json({ songs });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Create a song in a playlist
songRouter.post("/create-song/:playlistId", authMiddleware, async (req, res) => {
  const playlistId = req.params.playlistId; // Playlist ID from the URL
  const { title, artist} = req.body; // Song details from the request body

  if (!title || !artist) {
    return res.status(400).json({ message: "Title and artist are required" });
  }

  try {
    const userId = req.user.id;
    // Insert the song into the songs table
    const { data, error } = await supabase.from("songs").insert([{
      title,
      artist,
      playlist_id: playlistId,
      user_id: userId,
      song_id: title+Date().toString,
    }]);

    if (error) {
      return res.status(500).json({ message: "Error creating song", error });
    }

    return res.status(201).json({ message: "Song created successfully", song: data[0] });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update a song in a playlist
songRouter.put("/update-song/:songId", authMiddleware, async (req, res) => {
  const songId = req.params.songId; // Song ID from the URL
  const { title, artist} = req.body; // Song details from the request body

  // Validate inputs
  if (!title && !artist) {
    return res.status(400).json({ message: "At least one field (title, artist, or duration) is required to update the song" });
  }

  try {
    const userId = req.user.id;
    // Fetch the song and ensure it belongs to the user and playlist
    const { data: song, error: fetchError } = await supabase
      .from("songs")
      .select("*")
      .eq("song_id", songId)
      .eq("user_id", userId)
      .single();

    if (fetchError) {
      return res.status(500).json({ message: "Error fetching song", error: fetchError });
    }

    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    // Prepare the update data
    const updateData = {};
    if (title) updateData.title = title;
    if (artist) updateData.artist = artist;

    // Update the song
    const { data: updatedSong, error: updateError } = await supabase
      .from("songs")
      .update(updateData)
      .eq("song_id", songId)
      .eq("user_id", userId);

    if (updateError) {
      return res.status(500).json({ message: "Error updating song", error: updateError });
    }

    return res.status(200).json({ message: "Song updated successfully", song: updatedSong[0] });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete a song from a playlist
songRouter.delete("/delete-song/:songId", authMiddleware, async (req, res) => {
  const songId = req.params.songId; // Song ID from the URL
  try {
    const userId = req.user.id;
    // Fetch the song and ensure it belongs to the user
    const { data: song, error: fetchError } = await supabase
      .from("songs")
      .select("*")
      .eq("song_id", songId)
      .eq("user_id", userId)
      .single();

    if (fetchError) {
      return res.status(500).json({ message: "Error fetching song", error: fetchError });
    }

    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    // Delete the song
    const { error: deleteError } = await supabase
      .from("songs")
      .delete()
      .eq("song_id", songId)
      .eq("user_id", userId);

    if (deleteError) {
      return res.status(500).json({ message: "Error deleting song", error: deleteError });
    }

    return res.status(200).json({ message: "Song deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});
