#!/usr/bin/env python
# -*- coding: utf-8 -*-


from flask import (Blueprint, render_template, redirect,
                   flash, url_for, request)
from flask import json,jsonify,render_template

import pandas as pd
import time
from datetime import datetime
from webapp.models import MyStock,Stock,DataItem,Comment
from webapp.services import data_service as dts,db_service as dbs,db
from flask import current_app as app

blueprint = Blueprint('setting', __name__)

@blueprint.route('/', methods = ['GET'])
def index():
    data = dbs.getItemDates()
    return render_template('/setting/index.html', title='设置',dataItems=data)

@blueprint.route('/update/', methods = ['GET','POST'])
def update():
    code = request.form['code']
    code = code[2:]
    flag = dts.updateFinanceBasic(code)
    return jsonify(msg=flag)

@blueprint.route('/updateAll/<int:cat>', methods = ['GET','POST'])
def updateAll(cat):
    #获得所有股票代码列表
    stocks = db.session.query(MyStock).filter(MyStock.code != '000001').all()
    if cat == 1:
        for st in stocks:
            app.logger.info('checking finance data for:' + st.code)
            dts.updateFinanceBasic(st.code)
        item = db.session.query(DataItem).filter_by(id=1).first()
        item.update_time = datetime.now()
        db.session.save(item)
    elif cat == 2:
        pass

    return render_template('/setting/index.html')
