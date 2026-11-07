---
title: Chess Engine
order: 3
year: 2026
tags: [C++, Algorithms, Minimax]
status: exploring
summary: I'm seeking to build a program which evaluates chess positions based on parameters like value, tile control, center control and king exposure
---

## Overview

I'm seeking to build a program which evaluates chess positions based on parameters like value, tile control, center control and king exposure. The idea is to generate a chess board, calculate the options until certain depth (until I decide which depth is best it will depend on my hardware capabilities) and build a MiniMax tree with alpha-beta prunning and a very basic improvement of eficiency which is to apply the filter to some positions in order to decide the order of exploration instead of doing a regular DFS.

## Motivation

I would like to achieve two things. First of all, I like playing chess, and I like the idea of dedicating a project to it, specially one that involves creating a tool which plays better than me. In addition, I would like to start a series of projects related with the concept of analizing "positions" and deciding which are the better options and specially breaking up which features make that option the best one or the least-bad one.

## Architecture

First of all I will need a chess board with working pieces and all the chess mechanics such as checkmate, stalemate, check, castling, en-passant and movements and captures of pieces.

After that, I can start with the evaluation. As of this early-thinking stage, I'm thinking of creating a MiniMax tree with alpha-beta prunning and improving the decision of which child to expand by means of evaluating childs positions. The criteria(at the moment) for the evaluation will be value, tile control, center control and king exposure. 


## Challenges & lessons
