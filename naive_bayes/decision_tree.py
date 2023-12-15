from sklearn.model_selection import train_test_split
# from find_all_the_words import save_data_as_count_csv
from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction.text import CountVectorizer, TfidfTransformer
from sklearn.pipeline import Pipeline, FeatureUnion
import pandas as pd
import matplotlib.pyplot as plt
from wordcloud import WordCloud
import random
import find_all_the_words
import nltk
from collections import Counter
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import ConfusionMatrixDisplay, accuracy_score
from sklearn.metrics import r2_score
from sklearn.model_selection import GridSearchCV
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import confusion_matrix
nltk.download('averaged_perceptron_tagger')



def decision_tree(question, data):

    # print(data)

    ##### Visualize your Data


    data["modified_sentence"]=data["question"].apply(find_all_the_words.Cleaning)
    # print (data["modified_sentence"])
    ### Let's change the sentence into a bag of word model
    from sklearn.feature_extraction.text import CountVectorizer
    vectorizer = CountVectorizer()#create a frequency map  of all words

    X = vectorizer.fit_transform(data["question"]).toarray()

    ###### Extra Tf-idf transformation and DataPipelines
    model = Pipeline([('vectoizer', CountVectorizer()), ('tfidf', TfidfTransformer())])#gives weight to words and importance.
    #split 80%-20%
    #crossvalidation 
    X_train = model.fit_transform(data["modified_sentence"]).toarray()
    # print("This is the training set: ", X_train)

    Y=data["answer"]
    #this is the most accurate seemingly
    #split into three different codes for each algo.
    clf3 = DecisionTreeClassifier().fit(X_train, Y)

    P=model.transform([find_all_the_words.Cleaning(question)])
    predict3=clf3.predict(P)
    print (predict3)
    return(predict3[0])


def decision_tree_stats(data):
    data["modified_sentence"]=data["question"].apply(find_all_the_words.Cleaning)
    # print (data["modified_sentence"])
    ### Let's change the sentence into a bag of word model
    from sklearn.feature_extraction.text import CountVectorizer
    vectorizer = CountVectorizer()#create a frequency map  of all words

    X = vectorizer.fit_transform(data["question"]).toarray()
    y = vectorizer.fit_transform(data["answer"]).toarray()

    ###### Extra Tf-idf transformation and DataPipelines
    # model = Pipeline([('vectoizer', CountVectorizer()), ('tfidf', TfidfTransformer())])#gives weight to words and importance.
    #split 80%-20%
    # len_of_data=int(len(data)/2)
    # X = data.iloc[:-1]
    # y = data.iloc[:2]

    print("X:")
    print(X)
    print("y")
    print(y)


    # print("model:")
    # print(X.fit_transform(X).toarray())

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.2, random_state = 42)

    print("X_train:")
    print(X_train)
    print("y_train")
    print(y_train)

    # dt_regressor = DecisionTreeRegressor(random_state = 0)
    dt_regressor = DecisionTreeClassifier()
    # X_train = model.fit_transform(data["modified_sentence"]).toarray()
    dt_regressor.fit(X_train, y_train)

    y_pred_train = dt_regressor.predict(X_test)
    # r2_score(y_train, y_pred_train)
    # print(r2_score(y_train, y_pred_train))
    accuracy = accuracy_score(y_test,y_pred_train)
    print("accuracy score: ",accuracy)
    print("test:")
    print(y_test)
    print("train:")
    print(y_pred_train)

    # cm = confusion_matrix(y_test.argmax(axis=1),y_pred_train.argmax(axis=1), labels=dt_regressor.classes_)
    cm = confusion_matrix(y_test,y_pred_train, labels=dt_regressor.classes_)
    disp = ConfusionMatrixDisplay(confusion_matrix=cm,display_labels=dt_regressor.classes_)
    plt.show()


    #visualize with a plot
    # fig, ax = plt.subplots()
    # ax.scatter(X_train,y_train, color = "red")
    # ax.scatter(X_train,y_pred_train, color = "blue")
    # plt.scatter(X_train,y_pred_train)
    # plt.show()


#import data here
print('DOWNLOADING SAMPLE DATA...')
# data = save_data_as_count_csv('naive_bayes/data.csv', 'naive_bayes/data_counted')
data=pd.read_csv('naive_bayes/data_best_copy.csv',encoding = "ISO-8859-1")
print('...SAMPLE DATA DOWNLOAD COMPLETE.')
decision_tree_stats(data)
# question=input("what is your question? ")
# print(decision_tree(question,data))






# time = 'time'
# ham_hours = 'ham_hours'
# yes_no = 'bool'
# open = 'open'
# close = 'close'
# answers = [time,ham_hours,yes_no,open,close]

# import js2py
# eval_result, example = js2py.run_file('../questions_dict.js')
# response = ''
# if(answer_find.includes(yes_no)):
#     if(answer_find.includes(open)):
#         if(answer_find.includes(ham_hours)):

#             if(answer_find.includes(time)):
#                 response+=''






