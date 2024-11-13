# Contributing to Expressjs.com

### The Offical Documentation of the Express Framework

**NOTE**: This is not the repo for Express JS. To contribute to the _[Express JS framework](https://github.com/expressjs/express)_ itself, [check this out](#were-the-express-js-frameworks-documetation-team---not-the-express-js-framework).

If you want to contribute to [https://github.com/expressjs/expressjs.com](https://github.com/expressjs/expressjs.com), you're in the right place. 


Whether you're a first time first time contributor or you're just looking for a refresher, visit our [Getting Started](#contributors-guide-to-getting-started) guide below to get up and runnning.

#### Want to help but need some ideas? These are some of our most typical issue types:

1.  **Website Related**: 
If you see anything on the site that could use a tune-up, think about how to fix it.

    - display or screen sizing problems
    - mobile responsiveness issues
    - missing or broken accessibility features 
    - website outages
    - broken links
    - page structure or user interface enhancements


2. **Content Related**: spelling errors, incorrect/outdated Express documentation, adding missing content.
    - _We love any reports of typos. If you see one, fixing it is a great way to help_.


3. **Translation Related**: spelling errors, incorrect/poorly translated words, adding new full site translations.
    > [!IMPORTANT]: All translation submissions are currently paused. See this [notice](#important-notice-we-have-paused-all-translation-contributions) for more information.
    - _If you want to do a full site translation, or just translate a single page, there's a section specifically related to [translations](#contributing-translations) below_.

#### Want to work on a backlog issue?

We often have bugs or enhancements that need work. You can find these on our repo [https://github.com/expressjs/expressjs.com/issues](https://github.com/expressjs/expressjs.com/issues). Check out the tags to find something that's a good match for you.

#### Have an idea? Found a bug?

If you've found a bug or a typo, or if you have an idea for an enhancement, please submit a [new issue](https://github.com/expressjs/expressjs.com/issues/new?assignees=&labels=&projects=&template=3other.md). You can do this by going to our [repo](https://github.com/expressjs/expressjs.com) and opening a "New Issue" under the **Issues** tab. If you submit it, we will respond.

## Contributor's Guide to Getting Started

If you want to learn about working on Expressjs.com, this is the right place. Follow the steps below to get started.

#### TL;DR
1. Open an issue and get approval.
2. Make your pull request, and celebrate being a contributor.


#### Step1: Opening a New Issue
So, you've found a problem that you want to fix, or have a site enhancement you want to make. 
1. The first step is to open an [issue](https://github.com/expressjs/expressjs.com/issues/new?assignees=&labels=&projects=&template=3other.md). 
    - Give the issue a good title and be sure to fill in the description section, writing as much detail on your proposal as possible.
    - Don't leave anything blank! The more details you provide the more feedback we can give.


2. Next, the Express documentation team will respond with feedback on your submission. We read all submissions and try our best to always respond quickly with feedback. 
    - After you've received approval, *only then* should you start work or make any pull requests. 
    - If you really want to see you work merged into a super popular open source project, *and you do*, please always follow our process and open an issue first. 
    - __Please don't skip straight to a pull request unless you are totally sure your work is unique__. This is just because we never want anyone's time or hard work to go to waste on dulicated work.

#### Step2: Get the Application Code Base

After you've been approved, now you can clone the repo and get the code.
- `git clone https://github.com/expressjs/expressjs.com.git`

This is a list of the main sections of the application, where most changes are likely to be made. This may help you identify where files you need to change live. 

**Markdown Page Files**: 
- These files render to html and make up the individual pages of the site. Most of the site's documentation text content is written in `md` files.
- Change these to make changes to individual pages' content/text or markup. 
- Each translation has it's own complete set of pages, located under their respective language directories. Ex. English middleware page is located at `en > resources > middleware.md.`

**Template Includes and Layout Files**
- These file are page components that make up the user interface and periphery structure. Ex. Header, Footer, etc.
- There are also markdown files here that are *included* within other larger files. Ex `api > en` holds the API Reference text content.
- Change these to make changes to page layouts or site-wide structures, or to change the API Reference documentation.
- Located mainly under `_includes` and `_layouts`. API markdown and text content are located under `_includes/api`.

**Blog Markdown Files**
- These files make up the individual blog posts. If you want to contribute a blog post please
follow the specific instructions for [How to write a blog post.](https://expressjs.com/en/blog/write-post.html)
- Located under the `_posts` directory. 

**CSS or Javascript**
- All css and js files are kept in `css` and `js` folders on the project root.

#### Step3: Running the Application


Now you'll need a way to see your changes, which means you'll need a running version of the application. You have two options. 
1. __Run Locally__: This gets the local version of the application up and running on your machine. Follow our [Local Setup Guide](https://github.com/expressjs/expressjs.com?tab=readme-ov-file#local-setup) to use this option.  
    - This is the recommended option for moderate to complex work. 
2. __Run using Deploy Preview__: Use this option if you don't want to bother with a local installation. Part of our continuous integration pipeline includes [Netlify Deploy Preview](https://docs.netlify.com/site-deploys/deploy-previews/). 
    - To use this you'll need to get your changes online - after you've made your first commit on your feature branch, make a *draft* pull request. 
    - After the build steps are complete, you'll have access to a __Deploy Preview__ tab that will run your changes on the web, rebuilding after each commit is pushed. 
    - After you are completely done your work and it's ready for review, remove the draft status on your pull request and submit your work. We will review it and respond. 
  
{% include contributing/translations.md %}

## We're the Express JS Framework's Documetation Team - Not the Express JS Framework

If you are looking for the repository for the **Express JS Framework**, you've hopefully noticed by now that you've come to the wrong place. This page is only for issues related to the this website: [http://expressjs.com](http://expressjs.com). 

For more information on contributing to Express itself, check our out our [Contributing to Express](/{{ page.lang }}/resources/contributing.html) page. For anything else, visit the repository [https://github.com/expressjs/express](https://github.com/expressjs/express).