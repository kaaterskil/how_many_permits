## HubHacks 2014
## Challenge #1: What Permits Do I Need?

### Prologue

This project was interesting on a number of fronts. As a demonstration of a questionnaire wizard, this is an exploration into the intricacies of a variant of the Linked List data structure. It also explores dynamically generating the list in a rich front-end environment. And it demonstrates the ability to solve the goal of the hackathon challenge by providing a means to improve the user experience and flow of questions in any number of ways without breaking the underlying system.

Unlike most collections that utilize either an underlying array or hash, a linked list contains nodes that contain the assigned value and a reference to the next node. The list container knows only of the head node, and iterates through its collection via its node references. A doubly-linked list has references in both directions and therefore is aware of both its head an tail nodes.

The wizard defined by the City of Boston Inspectional Services Department is offered to the site visitor as a means to identify the number of permits their project may require bsed on a series of questions and possible responses. Depending on the user's responses, new branches of questions may be triggered.

We solved the data structure using the Strategy pattern in which a wizard question (called a 'Step' in this project), acts as the Context upon an unlimited number of possible concrete 'Response' Strategies. The single execute() method called by the Step on a Response simply returns the next Step.

In a further twist, when a branch of questions is completed, the application picks up from the original question and continues forward, rather than ending the wizard at the end of that branch. In this way, our list has only one head and only one tail.

In this manner, we dynamically create our list with a modicum of loose coupling. Now we are able to persist and iterate over our collection, create new ones, and can return questionnarie results to the user. When the user response creates a new branch of questions, the branch is inserted within the list. In addition, the user is able to select a prior question and change their response - the list will regenerate from that point, possibly creating new branches depending on the user's new reponse.

Following is the text of the hackathon challenge:

### 1. Purpose

Which Permits Do I Need?:  A single project may require multiple permits. Applicants need a clear, intuitive, and enjoyable guide that will help applicants identify the permits they need to start working!

Determining the correct set of permits is a complex process. Our goal for this challenge is to prototype an excellent user experience for applicants. We encourage you to focus on a good concept and user experience, not on completeness in capturing every possible scenario of the permit workflow.

### 2. Background

Many projects require a number of permits from multiple departments, such as the Inspectional Services Department (ISD), Boston Fire Department (BFD), the Public Works Department (PWD), the Boston Transportation Department (BTD), Consumer Affairs & Licensing, etc. Customers interact with these departments sequentially or in parallel, often without a clear understanding of all needed permits/licenses and the requirement to get them up front. This leads to many customers getting far into the permit process in one Department without starting needed permits in another Department, resulting in frustration, project delays, and difficulty determining where they are in the overall approval process.

The city is working on improving the business process which would help individuals identify what they need. In the meanwhile, we are looking for an improved product that can point people in the right direction, and provides a better user experience.

Right now the city has two resources which help customers navigate what they need:

First, the City outlines some of the major building permit types on its website. This list is not complete, nor is it as user-friendly as we would like. One could easily go this website and not be able to determine all of the permits they need.

Second, the City’s provides the Licensing & Permitting Wizard through its Business Hub website. This wizard is designed to help current and potential business owners figure out what permits they need. While the language is geared towards small businesses, the results would work for all construction (building and fire prevention) permits. It is powered by the business hub table.

### 3. Scenario

An entrepreneur named Linh wants to open a convenience store with an ice cream window. Linh is dedicated to figuring out what she needs, but she has no idea where to start. She feels lost and doesn't want to spend months chasing down the wrong permits. Linh has a business plan, location, registration, and tax ID, but doesn’t know what uses are permitted at her location, or what the underlying zoning allows for. The location she purchased was most recently used as a shoe store.

Based on some sample answers, it would take Linh at least 10 minutes, and almost 30 questions to get to the end of the business hub wizard, and she would be left with a long list of information to sift through.

One way to handle this challenge would be to use the business hub table to create an application that would enable Linh know what permits she has to apply for, but make it more intuitive, easy to use, and doesn’t feel like a standardized test.

Alternatively, you can provide us with a concept of how to make this process more user friendly. Feel free to use any of data, maps, tables, city websites, resources provided in other challenges, or generally available information to develop something new entirely. For this challenge, we care most about developing creative, improved ways to do this better than about receiving a product we can use tomorrow.

### 4. Supporting Docs

About the Permitting Wizard:

The current  Licensing & Permitting Wizard is set up in the form of a question tree Again, we are not asking you to replicate this exact model or navigating the information, but think it will be useful for you to see how it currently works.

The questions are currently layered into the following categories:
1) Initial questions
2) General, questions
3) Construction questions
4) Business definition
5) Business specific types

Anyone who takes the Wizard receives all initial and general questions, the other questions are triggered by dependencies from answers to the construction or business definition questions.  The workflow of these dependencies are provided in column E. Based on the answers to the questions, answers are displayed at the end creating a PDF of information for those who complete the Wizard.

For this example, assume Linh has a business plan, location, registration, and tax ID, but doesn’t know what the location she has in mind is zoned for. Therefore, Linh answers yes to questions 1-4, but no to question 5. This will not impact her continuing of the wizard, but will affect what is displayed once she has completed all of the questions.

### About the Business Hub Table:

For each question that the Wizard displays, these questions in Column C, with the possible answers indicated in Column D.  For some answers in Column D, there is corresponding information the City needs to share with Linh to help guide; that information is in Column F.  In this case, given that Linh doesn’t know what her building is zoned for, the City needs share the content in F17. (Note that in some cases, “yes” returns an answer, and in others “no” returns an answer, depending on which response would yield a need for more information).

There are a few dependencies built into the table. For example, question 13 in the Business Hub Table (Row 13, Column C) asks if Linh is building a new structure. There are three possible answers to this question.  Those are defined in Column D, Rows 39 - 41. If Linh answers yes or I don’t know, the City not only needs the corresponding information in column F to be shared, but also needs to ask questions 22-28, which is indicated in Column E.
