from flask import Flask, request, render_template_string
import pandas as pd
import os

app = Flask(__name__)

# Read HTML content from files
with open('info.html', 'r') as file:
    info_html = file.read()

with open('intrest.html', 'r') as file:
    interest_html = file.read()

with open('reflect.html', 'r') as file:
    reflect_html = file.read()

with open('avaliable.html', 'r') as file:
    available_html = file.read()

with open('writing.html', 'r') as file:
    writing_html = file.read()

@app.route('/info')
def info():
    return render_template_string(info_html)

@app.route('/interest', methods=['POST'])
def interest():
    return render_template_string(interest_html)

@app.route('/reflect', methods=['POST'])
def reflect():
    return render_template_string(reflect_html)

@app.route('/available', methods=['POST'])
def available():
    return render_template_string(available_html)

@app.route('/writing', methods=['POST'])
def writing():
    return render_template_string(writing_html)

@app.route('/submit', methods=['POST'])
def submit():
    info_data = {
        "Full name": request.form.get('name'),
        "Phone number": request.form.get('phone'),
        "Date of birth": request.form.get('birth'),
        "Gender": request.form.get('gender'),
        "School": request.form.get('school'),
        "Grade": request.form.get('grade'),
        "Nationality": request.form.get('nationality'),
        "Email": request.form.get('email')
    }

    interest_data = {
        "Research Areas": ", ".join(request.form.getlist('areas')),
        "GPA": request.form.get('gpa'),
        "Field GPA": request.form.get('gp')
    }

    reflect_data = {
        "Einstein Quote Analysis": request.form.get('q2'),
        "Research Background": request.form.get('q3'),
        "Communication in Research": request.form.get('q4')
    }

    available_data = {
        "Weekly Hours": request.form.get('hours'),
        "Significant Time Blocks": request.form.get('time_blocks')
    }

    writing_data = {
        "Research Qualification Essay": request.form.get('essay1'),
        "Academic Writing Essay": request.form.get('essay2')
    }

    combined_data = {**info_data, **interest_data, **reflect_data, **available_data, **writing_data}

    df = pd.DataFrame([combined_data])

    # Save to Excel
    excel_file = 'output.xlsx'
    if not os.path.exists(excel_file):
        df.to_excel(excel_file, index=False)
    else:
        with pd.ExcelWriter(excel_file, mode='a', if_sheet_exists='overlay') as writer:
            df.to_excel(writer, index=False, header=False, startrow=writer.sheets['Sheet1'].max_row)

    return "Form submitted successfully!"

if __name__ == '__main__':
    app.run(debug=True)
