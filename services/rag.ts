"use server";
import OpenAI from "openai";
import { pipTask, pipResource } from "@/db/schema";
import db from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";


/*
 This function creates the embeddings of the new resources added to the database
*/
async function create_embedding() {
  const openai = new OpenAI();
  const resource_id = 1
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: "Your text string goes here",
    encoding_format: "float",
  });

  console.log(embedding);
}


/*
 This function is triggered each time a sprint surey is finished to get the feedback of the user and to recommend the best resources
*/
async function pip_search() {
	// get the feedback of the user

	// clasify comments into positve and negative, biases are classified as negative (comments related to race, skin color, beliefs, gender, sexual preferences, insults) the user is stored and the comment

	// the negative comments are joined in a single string to create the embedding
	
	// limit the input to the maximum amount of tokens permitted

	// the positive comments are turned into kudos
	
}


/*
 This function creates the tasks of the user that complement the resources chosen for his pip,
they are meant to be different than the resources selected
*/
async function create_tasks() {
	// choose the resources selected after the 5th position

	// if the resources are very different from the original feedback then the tasks are made with the selected resources

	// Create the tasks based with the type of the resource (book, video, documental, visit family), the job that must be accomplished (read N pages, read a chapter, visit my family, excercise) and the favorite format of the user (book, video, documental, visit family)

	// Check if the new tasks are related or are very similar to the previous tasks of the user, if this is the case the new task has a custom color indicating that it has been selected more than once

}
