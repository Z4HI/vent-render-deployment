import express from "express";
import Tree from "../models/TreeSchema.js";
import User from "../models/userSchema.js";
import badge from "../helper/badgeSystem.js";

const app = express();
app.post("/tree", async (req, res) => {
    console.log("purchase tree route");
    const { tree0,treeType,userId,price } = req.body;

    console.log(tree0,treeType,userId,price);
    try{
    const TreeProperties= await Tree.findById(tree0);
    const user= await User.findById(userId);

    const totalVentCoinsSpent = user.totalVentCoinsSpent+=price;
    const userBadge = badge(totalVentCoinsSpent);

    user.totalVentCoinsSpent = totalVentCoinsSpent;
    user.badge = userBadge;

    const skies= TreeProperties.SkyArray;
    const islands= TreeProperties.IslandsArray;
    const guardians= TreeProperties.GuardianArray;
    const music= TreeProperties.MusicArray;

    const newTree = new Tree({
        type: treeType,
        treeImage: treeType+".png",
        guardian: "",
        treeLevel: 1,
        items: [],
        createdAt: new Date(),
        SkyArray: skies,
        ActiveSky: "blue",
        IslandsArray: islands,
        ActiveIsland: "basicFloatingIsland",
        GuardianArray: guardians,
        ActiveGuardian: "",
        MusicArray: music,
        ActiveMusic: "",
      });
      await newTree.save();
      user.Trees.push(newTree);
      user.VentCoins -= price;
      await user.save();

      res.status(200).json({ success: true, newTree, user });
    }catch(error){
      res.status(500).json({ success: false, message: "Error purchasing tree", error });
    }

});

app.post("/sky", async (req, res) => {

    const { skyType,userId,userTrees,price } = req.body;

    const user= await User.findById(userId);
    const totalVentCoinsSpent = user.totalVentCoinsSpent+=price;
    const userBadge = badge(totalVentCoinsSpent);
    user.totalVentCoinsSpent = totalVentCoinsSpent;
    user.badge = userBadge;
    const trees= await Tree.find({_id: {$in: userTrees}});

    trees.forEach(async (tree) => {
        tree.SkyArray.push(skyType);
        await tree.save();
    });

    user.VentCoins -= price;
    await user.save();

    res.status(200).json({ success: true, message: "Sky purchased", user, trees });


    //push item to all trees in user Trees array


});

app.post("/island", async (req, res) => {


});


app.post("/avatar", async (req, res) => {
  console.log("purchase avatar route");
  const { avatarType,userId,price } = req.body;

  const user= await User.findById(userId);
  const totalVentCoinsSpent = user.totalVentCoinsSpent+=price;
  const userBadge = badge(totalVentCoinsSpent);
  user.totalVentCoinsSpent = totalVentCoinsSpent;
  user.badge = userBadge;
  user.profileImageCollection.push(avatarType);
  user.VentCoins -= price;
  await user.save();

  res.status(200).json({ success: true, message: "Avatar purchased", user });


  //push item to all trees in user Trees array

});








export default app;



