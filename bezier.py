x1,y1 = 0,100
x2,y2 = 972,-170
x3,y3 = 2268,52
x4,y4 = 2880,5
X,Y = [], []
for a in range(0,1000):
    t = a / 1000.
    x = (1-t*t*t)*x1 + 3*(1-t)*(1-t)*t*x2 + 3*(1-t)*t*t*x3 + t*t*t*x4
    y = (1-t*t*t)*y1 + 3*(1-t)*(1-t)*t*y2 + 3*(1-t)*t*t*y3 + t*t*t*y4
    print t, x, y
    X.append(x)
    Y.append(y)

x1,y1 = 0,100
x2,y2 = 972,-150
x3,y3 = 2268,52
x4,y4 = 2880,15
X2,Y2 = [], []
for a in range(500,1000):
    t = a / 1000.
    x = (1-t*t*t)*x1 + 3*(1-t)*(1-t)*t*x2 + 3*(1-t)*t*t*x3 + t*t*t*x4
    y = (1-t*t*t)*y1 + 3*(1-t)*(1-t)*t*y2 + 3*(1-t)*t*t*y3 + t*t*t*y4
    print t, x, y
    X2.append(x)
    Y2.append(y)

import matplotlib.pyplot as plt
plt.plot(X, Y, 'ro')
plt.plot(X2, Y2, 'bo')
#plt.axis([0, 6, 0, 20])
plt.show()
