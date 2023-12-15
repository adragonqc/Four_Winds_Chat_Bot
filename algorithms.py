# from sklearn.model_selection import train_test_split
# # from find_all_the_words import save_data_as_count_csv
# from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction.text import CountVectorizer, TfidfTransformer
from sklearn.naive_bayes import GaussianNB
from sklearn.pipeline import Pipeline, FeatureUnion
import pandas as pd
import csv
# import matplotlib.pyplot as plt
# from wordcloud import WordCloud
# import random
import sys
import find_all_the_words
import nltk
# from collections import Counter
# from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
# from sklearn.metrics import ConfusionMatrixDisplay, accuracy_score
# from sklearn.metrics import r2_score
# from sklearn.model_selection import GridSearchCV
# from sklearn.tree import DecisionTreeRegressor
# from sklearn.metrics import confusion_matrix
nltk.download('averaged_perceptron_tagger')

def naive_bayes(question, data):
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

    Y=data["label"]


    P=model.transform([find_all_the_words.Cleaning(question)])
    clf2 = GaussianNB().fit(X_train, Y)
    # P=model.transform([Cleaning(question)])
    predict2=clf2.predict(P.toarray())
    print(predict2)
    return (predict2[0])


def decision_tree(question, data):
    print(question)
    ##### Visualize your Data
    data["modified_sentence"]=data["question"].apply(find_all_the_words.Cleaning)
    # print (data["modified_sentence"])
    ### Let's change the sentence into a bag of word model
    from sklearn.feature_extraction.text import CountVectorizer
    vectorizer = CountVectorizer()#create a frequency map  of all words
    print("p1")

    X = vectorizer.fit_transform(data["question"]).toarray()

    ###### Extra Tf-idf transformation and DataPipelines
    model = Pipeline([('vectoizer', CountVectorizer()), ('tfidf', TfidfTransformer())])#gives weight to words and importance.
    #split 80%-20%
    #crossvalidation 
    X_train = model.fit_transform(data["modified_sentence"]).toarray()
    # print("This is the training set: ", X_train)

    Y=data["label"]
    print("p2: ",X)
    #this is the most accurate seemingly
    #split into three different codes for each algo.
    clf3 = DecisionTreeClassifier().fit(X_train, Y)

    P=model.transform([find_all_the_words.Cleaning(question)])
    print("p3")
    predict3=clf3.predict(P)
    print("p4")
    print(predict3)
    print("p5")
    return(predict3[0])




data=pd.read_csv(sys.argv[2],encoding = "ISO-8859-1")
returny = naive_bayes(sys.argv[1], data)
print(returny)
with open('save.txt', 'w', newline='') as csvfile:
    csvfile.write(returny)
    # Create a CSV writer
    # csv_writer = csv.writer(csvfile)
    # csv_writer.writerow(["label"])
    # csv_writer.writerow([returny])
    csvfile.close()



