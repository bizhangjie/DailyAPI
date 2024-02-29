#!/usr/bin/python3.10
# -------------------------------------------------
# -*- coding: utf-8 -*-
# @Time    : 2024/2/28 19:44
# @Author  : 章杰
# @Email   : zj@buxiangyao.link
# @File    : response
# @Software: PyCharm
# @ Description：I'm in charge of my Code
# -------------------------------------------------

from flask import jsonify

class Response:
    @staticmethod
    def success(data=None, message="Success", status=200):
        response = {
            "status": status,
            "message": message,
            "data": data
        }
        return jsonify(response), status

    @staticmethod
    def error(message="Error", status=400):
        response = {
            "status": status,
            "message": message
        }
        return jsonify(response), status
