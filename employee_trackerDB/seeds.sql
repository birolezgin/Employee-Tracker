USE employee_trackerDB;

INSERT INTO department (name)
VALUES ("Management"),("HR"),("Accounting");

INSERT INTO role (title, salary, department_id)
VALUES ("manager", 120000,1),("engineer", 100000,2), ("technician", 80000,3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
("George", "Kleyn", 1,NULL),
("Micheal", "Cruse", 2,1);

SELECT * FROM department;
select * from role;
select * from employee;

