<%@ page import="service.DatabaseDriver" %>
Welcome to the Login Page
<%--This page handles the login with the Google Login API and redirects to the AuthyAuth.jsp page once the user successfully login--%>
<% DatabaseDriver databaseDriver = new DatabaseDriver();%>