USE employee_trackerDB;

INSERT INTO department (name)
VALUES ("Management"),("HR");

INSERT INTO role (title, salary, departmend_id)
VALUES ("manager", 120000,1),("employee", 70000,2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("George", "Kleyn", 1,NULL),("Micheal", "Cruse", 2,NULL);
