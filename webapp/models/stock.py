from webapp.services import db
from datetime import datetime
import urllib2,re

class Stock(db.Model):
    __tablename__ = 'stock_basic'

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(255))
    name = db.Column(db.String(255))
    flag = db.Column(db.String(5))

    industry = db.Column(db.String(255))
    area = db.Column(db.String(255))

    zgb = db.Column(db.Numeric)
    ltgb = db.Column(db.Numeric)
    launch_date = db.Column(db.Date)
    latest_report = db.Column(db.Date)
    holder_updated_time = db.Column(db.DateTime)
    trade_updated_time = db.Column(db.DateTime)
    finance_updated_time = db.Column(db.DateTime)
    desc = db.Column(db.String(500))
    grow_type = db.Column(db.String(3))

    def __init__(self, name, code):
        self.name = name
        self.code = code

    def __repr__(self):
        return '<Stock %r>' % self.id

    @classmethod
    def find_by_code(self,cd):
        return Stock.query.filter_by(code=cd,flag=0).first()

    @property
    def current_price(self):
        try:
            data = self.query_trade_data()
            return round(float(data[3]), 2)
        except:
            return None

    def query_trade_data(self):
        url = "http://hq.sinajs.cn/list=" + self.code
        req = urllib2.Request(url)
        res_data = urllib2.urlopen(req).read()
        match = re.search(r'".*"', res_data).group(0)
        trade_data = match.split(',')
        return trade_data
