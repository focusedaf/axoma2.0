import express, { Request, Response } from "express";
import prisma from "../db/db";
import { setupProfileSchema } from "../zod/zod";

export const setupStudentProfile = async (req: Request, res: Response) => {};
export const setupProfessorProfile = async (req: Request, res: Response) => {};

export const editStudentProfile = async (req: Request, res: Response) => {};
export const editProfessorProfile = async (req: Request, res: Response) => {};

export const getStudentProfile = async (req: Request, res: Response) => {};
export const getProfessorProfile = async (req: Request, res: Response) => {};
