//Dependincies
const mysql = require("mysql");
const inquirer = require("inquirer");

//connection to database
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "243866be.",
    database: "employee_trackerDB"
});

connection.connect();

// Inquirer prompt and promise
searchDB();

function searchDB() {
    inquirer
        .prompt({
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: [
                "View All Departments",
                "View All Roles",
                "View All Employees",
                "Add Department",
                "Add Role",
                "Add Employee",
                "Update Employee Role",
                "Remove Employee",
                "Exit"
            ]

        }).then((response) => {
            switch (response.action) {
                case "View All Departments":
                    viewAllDepartments();
                    break;
                case "View All Roles":
                    viewAllRoles();
                    break;
                case "View All Employees":
                    viewAllEmployees();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Update Employee Role":
                    updateEmployeeRole();
                    break;
                case "Remove Employee":
                    removeEmployee();
                    break;
                default :
                    exitApp();
                    break;
            }
        })
}

function exitApp() {
    console.log("Ending Program!");
    process.exit();
}

// allows user to view all departments currently in the database
function viewAllDepartments() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.table(res);
        searchDB();
    })
    
}

// allows user to view all employees currently in the database
function viewAllEmployees() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        console.table(res);
        searchDB();
    })
    
}

// allows user to view all employee roles currently in the database
function viewAllRoles() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        console.table(res);
        searchDB();``
    })
    
}

// allows user to add a new departmet to database


function addDepartment() {
    inquirer.prompt([
        {
            message: "Please input the name of the department you wish to add.",
            type: "input",
            name: "department"
        }
    ]).then(function (answer) {
        let newDepartment = answer.department;

        connection.query("INSERT INTO department (name) VALUES (?)", [newDepartment], function (err, res) {
            if (err) throw err;

            console.log("Department successfully added!");
    
        });
    });
};


// allows user to add a new role to database
function addRole() {
    connection.query(`SELECT * FROM department`, (err, department) => {
        if (err) throw err;
        const departmentList = department.map(d => {
            return {
                name: d.department_name,
                value: d.id
            }
        })
        inquirer.prompt([
            {
                type: "input",
                name: "title",
                message: "What is the title of this new role?"
            },
            {
                type: "input",
                name: "salary",
                message: "What is the salary of this role?"
            },
            {
                type: "list",
                name: "department",
                message: "What department would you like to add this to?",
                choices: departmentList
            }
        ]).then((res) => {
            connection.query(`INSERT INTO role(title, salary, department_id) VALUES ("${res.title}","${res.salary}","${res.department}")`, (err, res) => {
                if (err) throw err;
                searchDB();
            })
            console.log("Role has been added!");
        })

    
    })
   
        
}

// allows user to add a new employee to database
function addEmployee() {
    connection.query(`SELECT * FROM role`, (err, role) => {
        if (err) throw err;
        const roleList = role.map(r => {
            return {
                name: r.title,
                value: r.id
            }
        })
        inquirer
          .prompt([
            {
              type: "input",
              name: "first_name",
              message: "What is the first name of the new employee?",
            },
            {
              type: "input",
              name: "last_name",
              message: "What the last name of the new employee?",
            },
            {
              type: "list",
              name: "role_id",
              message: "What is the role of this new employee?",
              choices: roleList,
            },
          ])
          .then((res) => {
            connection.query(
              `INSERT INTO employee(first_name, last_name, role_id) 
            VALUES ("${res.first_name}", "${res.last_name}", ${res.role_id})`,
              (err, res) => {
                if (err) throw err;
                searchDB();
              }
            );
            console.log("Employee has been added!");
          });
    })
}


// allows user to remove an employee from database
function removeEmployee() {
    connection.query(`SELECT * FROM role`, (err, role) => {
        if (err) throw err;
        const roleList = role.map(r => {
            return {
                name: r.title,
                value: r.id
            }
        })
        inquirer
          .prompt([
            {
              type: "input",
              name: "first_name",
              message: "What is the first name of the employee?",
            },
            {
              type: "input",
              name: "last_name",
              message: "What the last name of the employee?",
            },
            {
              type: "list",
              name: "role_id",
              message: "What is the role of this employee?",
              choices: roleList,
            },
          ])
        .then(function(res){
            connection.query(
                `DELETE FROM employee(first_name, last_name, role_id) 
              VALUES ("${res.first_name}", "${res.last_name}", ${res.role_id})`,
                (err, res) => {
                  if (err) throw err;
                  searchDB();
                }
              );
              console.log("Employee has been removed!");
            });
      })
  }
  

// grabs all employees (id, first name, last name) and then allows user to select employee to update role
function updateEmployeeRole() {
    connection.query(`SELECT * FROM employee`, (err, employee) => {
        if (err) throw err;
        const allEmployees = employee.map(e => {
            return {
                name: `${e.first_name} ${e.last_name}`,
                value: e.id
            }
        });
        connection.query(`SELECT title, id FROM role`, (err, role) => {
            if (err) throw err;
            const updateRole = role.map(r => {
                return {
                    name: r.title,
                    value: r.id
                }
            })
            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "employee",
                        message: "Which Employee Role would you like to update?",
                        choices: allEmployees
                    },
                    {
                        name: "role",
                        type: "list",
                        message: "What role are you adding?",
                        choices: updateRole
                    }
                ]).then((res) => {
                    connection.query(`UPDATE employee SET role_id=${res.role} WHERE id=${res.employee}`, (err, res) => {
                        if (err) throw err;
                        searchDB();
                    });
                });
        });
        
           
    });
}


