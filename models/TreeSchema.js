import mongoose from "mongoose";

const treeSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    treeImage: {
        type: String,
        required: true,
    },
    guardian: {
        type: String,
        required: false,
    },
    treeLevel: {
        type: Number,
        required: false,
        default: 1,
    },
    items: {
        type: Array,
        required: false,
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    SkyArray: {
        type: [],
        required: false,
        default: ['blue'],

    },
    ActiveSky: {
        type: String,
        required: false,
        default: 'blue',
    },
    IslandsArray: {
        type: [],
        required: false,
        default: ['basicFloatingIsland'],
    },
    ActiveIsland: {
        type: String,
        required: false,
        default: 'basicFloatingIsland',
    },
    GuardianArray: {
        type: [],
        required: false,
        default: ['guardian1', 'guardian2', 'guardian3'],
    },
    ActiveGuardian: {
        type: String,
        required: false,
        default: "guardian1",
    },
    MusicArray: {
        type: [],
        required: false,
        default: ['music1', 'music2', 'music3'],
    },
    ActiveMusic: {
        type: String,
        required: false,
        default: "music1",
    }
        
});

const Tree = mongoose.model("Tree", treeSchema);

export default Tree;