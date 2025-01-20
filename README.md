# GAB X Muhammadiyah Welfare Home

# 1. Introduction 
The Minimart and Voucher System for Muhammadiyah Welfare Home (MWH) is a web-based application designed to empower residents and streamline operational management. Built with the vision of fostering a nurturing and efficient environment, this system provides an intuitive platform for residents to request products, earn and manage vouchers, and track their transactions, while equipping administrators with powerful tools for user, inventory, and voucher management.
Purpose and Objectives
This system addresses the unique needs of MWH, a home dedicated to supporting boys on its campus by fostering their growth and well-being. By leveraging technology, the system aims to:
Empower Residents (Users): Provide an easy-to-use platform to request products, manage vouchers, and track account activity.
Streamline Administrative Operations: Enable staff to efficiently manage user accounts, voucher approvals, and inventory while maintaining detailed reporting for accountability.
# 2. Installation
Prerequisites
- Node.js version [10.8.2]
- npm (Node Package Manager)
- Firebase account for authentication setup

Clone repository  
git clone https://github.com/username/project-name.git

Navigate to project directory
cd my-app

Install Node.js environment and dependencies
npm install

Set Up Firebase
- create a Firebase project
- Enable Authentication and Firestore
- Update the firebaseConfig in the code with your credentials

Start the application
	npm start
# 3. Usage
Option 1: Run the application remotely on local Server

Option 2: Follow Link to Deployed App, https://muhamaddiyah-minimart.netlify.app/ 

>>> User: joshuachen03@gmail.com, Password: 123456
>>> 
>>> Staff: pengrongneo@gmail.com, Password: 12345678
>>> 
>>> To create new staff account, staff ID: MWHSTAFF123

# 4. Features
For Users:
Feature 1:
User Friendly Dashboard showing voucher balances, transaction history, and available products
Voucher Balances
The dashboard prominently displays voucher balances, allowing users to quickly check their available credit.
Real-time updates ensure that users always have an accurate view of their remaining balance

Transaction History
Shows date and time of transaction, and product purchased
Filter function to retrieve information for certain time periods

Available Products
Search bar for quick navigation of items
Shows name, price and quantity of items
Cart to for users to track what they have planned to purchase

Task Log
For users to submit tasks supervised by admin staff 
Allows users to earn points based on tasks completed


Feature 2: 
Requesting and Pre-ordering products that are out of stock
In the products page, users will see all the products currently listed in the mart
For products highlighted in red, the quantity is less than 5
For products without any stock, it is impossible to add to cart, requiring users to request it at the bottom of the page
The “Request a Product” form serves dual purposes, for indicating a product that is out of stock and a for requisition a product that is currently not on the market
 

Feature 3:
Secure Login and Registration System Using Firebase Authentication 
Separate Log In portals for users and staff as they require different functions
Sign-Up for new users
Password reset function through email via any mobile device


For Admins:
Feature 4:
Manage users and account settings
Admins will be able to remotely award and deduct voucher points to users to manage balances and discrepancies in their wallets
Able to help reset the password for users which will send a confirmation link to the users to input their new password
Admins will also be able to suspend or re-activate any user in the system

Feature 5:
Manage and Approve Users Voucher Tasks 
Review and Approve Voucher Tasks Submitted By Users
Able to determine and award voucher points for completion of tasks

Feature 6:
Product Management
Admin able to oversee product inventory and will highlight items in low stock
For newly requested Items, admin will be able to change the status of the request and add the product to the inventory via the system once the request is fulfilled
Admin will also be given control to adjust the quantity of stock when needed

Optional Feature:
Auction
Enable periodic auctions where residents can bid for special items using voucher points.
Admin will be able to put up special items for bidding for one week

# 5. Contributors
Joshua Chen Jia Hao
https://github.com/Nam3less-0 

Neo Peng Rong
https://github.com/PengRongNeo

Santtosh Mohan
https://github.com/santtoshh

Ong Song Yang Ethan
https://github.com/ethan267ong
