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
nltk.download('averaged_perceptron_tagger')

#import data here
print('DOWNLOADING SAMPLE DATA...')
# data = save_data_as_count_csv('naive_bayes/data.csv', 'naive_bayes/data_counted')
data=pd.read_csv('naive_bayes/data.csv',encoding = "ISO-8859-1")
print('...SAMPLE DATA DOWNLOAD COMPLETE.')

# print(data)

##### Visualize your Data
print ("Let's explore our question set",data["question"])
print ("Length of training set",len(data["question"]))
print ("Unique questions are",set(data["question"]))


##### Now let's create a wordcloud to get a better understanding of our corpus
def show_wordcloud(data, title = None):
    wordcloud = WordCloud(background_color='black',).generate(str(data))

    fig = plt.figure(1, figsize=(12, 12))
    plt.axis('off')
    plt.imshow(wordcloud)
    plt.show()
    
# show_wordcloud(data['question'])

data["question_punctuation_removed"]=data["question"].apply(find_all_the_words.remove_punctuation)
print (data["question_punctuation_removed"])

data["question_stopword_removed"]=data["question_punctuation_removed"].apply(find_all_the_words.remove_stopwords)
print (data["question_stopword_removed"])

data["question_negated"]=data["question_stopword_removed"].apply(find_all_the_words.negation_handling)
print (data["question_negated"])

data["question_descriptive"]=data["question_negated"].apply(find_all_the_words.descriptive_words)
print (data["question_descriptive"])

# words = []
# counts = []

# for row in data:
#     words.append(row['word'])
#     counts.append(row['count'])

# print(words)
# print(counts)
print(data)

### Stemming of Words
from nltk.stem.porter import PorterStemmer
st=PorterStemmer()#reduces word to base form, READ MORE ABOUT THIS (coming, came, will come)
def Stemming(text):
	stemmed_words=[st.stem(word) for word in text] 
	return stemmed_words

data["question_stemmed"]=data["question_descriptive"].apply(Stemming)
print (data["question_stemmed"])

### Recreating the sentence
def Recreate(text):
	word=" ".join(text)
	return word

data["modified_sentence"]=data["question_stemmed"].apply(Recreate)
print (data["modified_sentence"])	

def Cleaning(text):
    text_punctuation_removed=find_all_the_words.remove_punctuation(text)
    #text_stopword_removed=remove_stopwords(text_punctuation_removed)
    text_unnegated=find_all_the_words.negation_handling(text_punctuation_removed)
    text_descriptive=find_all_the_words.descriptive_words(text_unnegated)
    text_stemmed=Stemming(text_descriptive)
    final_text=Recreate(text_stemmed)
    return final_text
data["modified_sentence"]=data["question"].apply(Cleaning)
print (data["modified_sentence"])


### Let's change the sentence into a bag of word model
from sklearn.feature_extraction.text import CountVectorizer
vectorizer = CountVectorizer()#create a frequency map  of all words

'''['are' 'be' 'can' 'center' 'close' 'does' 'doesn' 'doesnt' 'enter' 'ham'
 'hami' 'hamilton' 'hours' 'is' 'isn' 'it' 'not' 'now' 'open' 'rn' 'soon'
 'the' 'time' 'what' 'when' 'why' 'will']'''

X = vectorizer.fit_transform(data["question"]).toarray()
print(X)
print(vectorizer.get_feature_names_out())


###### Extra Tf-idf transformation and DataPipelines
model = Pipeline([('vectoizer', CountVectorizer()), ('tfidf', TfidfTransformer())])#gives weight to words and importance.
#split 80%-20%
#crossvalidation 
X_train = model.fit_transform(data["modified_sentence"]).toarray()
print("This is the training set: ", X_train)



Y=data["answer"]
question="What are ham hours?"

#split datset into 80/20





clf1 = LogisticRegression().fit(X_train, Y)


P=model.transform([Cleaning(question)])
predict1=clf1.predict(P)
print (predict1)

from sklearn.naive_bayes import MultinomialNB
clf2 = MultinomialNB().fit(X_train, Y)

P=model.transform([Cleaning(question)])
predict2=clf2.predict(P)
print (predict2)


#this is the most accurate seemingly
#split into three different codes for each algo.
from sklearn.tree import DecisionTreeClassifier
clf3 = DecisionTreeClassifier().fit(X_train, Y)

P=model.transform([Cleaning(question)])
predict3=clf3.predict(P)
print (predict3)

final_predict=[]
final_predict=list(predict1)+list(predict2)+list(predict3)
final_predict = Counter(final_predict)
print ("Thus answer to your question is",final_predict.most_common(1)[0][0])

def Predict(text):
    P=model.transform([Cleaning(text)])
    predict1=clf1.predict(P)
    print (predict1)

    predict2=clf2.predict(P)
    print (predict2)
    
    predict3=clf3.predict(P)
    print (predict3)
    
    final_predict=[]
    final_predict=list(predict1)+list(predict2)+list(predict3)
    final_predict = Counter(final_predict)
    print (final_predict.most_common(1)[0][0])
    
    return final_predict.most_common(1)[0][0]

from sklearn import tree
from six import StringIO
from sklearn.tree import export_graphviz
import pydotplus

dot_data = StringIO()
export_graphviz(clf3, out_file=dot_data,  
                filled=True, rounded=True,
                special_characters=True)
graph = pydotplus.graph_from_dot_data(dot_data.getvalue())

print (graph)
graph.write_pdf("iris.pdf")
from IPython.display import Image

Image(graph.create_png())

